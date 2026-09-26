import datetime
import json
import os
import re
import time
from dataclasses import dataclass
from typing import TypedDict

import requests
from dotenv import load_dotenv


class Post(TypedDict):
    id: int
    date: int
    text: str
    attachments: list

@dataclass
class PlainDate:
    year: int
    month: int
    day: int

class Event(TypedDict):
    photos: list[str]
    text: str
    community: str
    post_id: int

load_dotenv()
TOKEN = os.environ["VK_TOKEN"]
UFA_TIMEZONE = datetime.timezone(datetime.timedelta(hours=5))
NOW = datetime.datetime.now(UFA_TIMEZONE)
TODAY = PlainDate(NOW.year, NOW.month, NOW.day)
BEGIN_DATE = int((NOW - datetime.timedelta(days=60)).timestamp())
# https://vk.com/uustufa
# Группа ВК Профком УУНиТ - https://vk.com/profcom_uust
# Профбюро ИИМРТ - https://vk.ru/pb_imrt
# Управление по молодежной политике - https://vk.com/uust_youth
# Управление по социальной работе - https://vk.com/soc_rabota_uunit
# Группа МФСО - https://vk.com/mfso_uust
# Центр компетенций УУНиТ - https://vk.com/corkuust
# Центр карьеры УУНиТ - https://vk.com/career.uust
# Совет молодых ученых УУНиТ - https://vk.com/smu_uust
# Группа Библиотеки УУНиТ - https://vk.com/library.uunit
# STUDBIT - https://vk.com/studbitt
# Ректор УУНиТ В.П. Захаров - https://vk.com/zaharovvp
COMMUNITIES = {
    "uustufa": "УУНиТ",
    "profcom_uust": "Профком",
    "pb_imrt": "Профбюро ИИМРТ",
    "uustesports": "Сектор киберспорта",
    "uust_youth": "Управление по молодежной политике",
    "soc_rabota_uunit": "Управление по социальной работе",
    "mfso_uust": "МФСО",
    "corkuust": "Центр компетенций",
    "career.uust": "Центр карьеры",
    "smu_uust": "Совет молодых ученых",
    "library.uunit": "Библиотека",
    "studbitt": "STUDBIT",
    "kampusufa": "Кампус",
    "21schoolufa": "Школа 21",
}


def get_posts_batch(community_id: int, offset: int, count: int) -> list[Post]:
    owner_id = -abs(community_id)
    response = requests.get(
        "https://api.vk.com/method/wall.get",
        params={
            "access_token": TOKEN,
            "v": "5.199",
            "owner_id": owner_id,
            "count": count,
            "offset": offset,
            "filter": "all",
        },
    )
    response.raise_for_status()
    data = response.json()

    if "error" in data:
        raise RuntimeError(data["error"])

    return data["response"]["items"]

def get_posts_since(community_id: int, since_date: int = 0) -> list[Post]:
    posts = []
    offset = 0
    batch_size = 100

    while True:
        batch = get_posts_batch(community_id, offset, batch_size)
        batch_recent = [x for x in batch if x["date"] >= since_date]
        if len(batch_recent) == 0:
            break
        posts += batch_recent
        offset += batch_size
        time.sleep(0.4)

    return posts


def get_community_id(name: str) -> int:
    response = requests.get(
        "https://api.vk.com/method/utils.resolveScreenName",
        params={
            "access_token": TOKEN,
            "v": "5.199",
            "screen_name": name,
        },
    )
    response.raise_for_status()
    data = response.json()

    if "error" in data:
        raise RuntimeError(data["error"])

    return data["response"]["object_id"]


def load_community_posts(name: str) -> list[Post]:
    id = get_community_id(name)
    return get_posts_since(id, BEGIN_DATE)


def parse_month(word: str) -> int:
    word = word.lower()
    MONTHS = ["янв", "фев", "мар", "мая", "апр", "июн", "июл", "авг", "сен", "окт", "ноя", "дек"]
    for i, month in enumerate(MONTHS):
        if word.startswith(month):
            return i + 1
    return -1

def detect_dates(post: Post) -> list[PlainDate]:
    words = post["text"].split()
    result = []
    for i, word in enumerate(words):
        days = []
        if word.isdecimal():
            if i - 2 >= 0 and words[i - 1] in ["до", "по"] and words[i - 2].isdecimal():
                days += [int(words[i - 2]), int(word)]
            else:
                days.append(int(word))
        elif re.fullmatch("\\d+[-–—−]\\d+", word) is not None:
            d1, d2 = re.split("[-–—−]", word)
            days += [int(d1), int(d2)]
        if i + 1 < len(words):
            for day in days:
                next = words[i + 1]
                month = parse_month(next)
                if month != -1:
                    result.append(PlainDate(0, month, day))
    return result


def guess_year(date: PlainDate, today: PlainDate)-> int:
    month_diff = date.month - today.month
    if month_diff < 0:
        month_diff += 12
    if month_diff < 6:
        if date.month >= today.month:
            return today.year
        else:
            return today.year + 1
    else:
        if date.month >= today.month:
            return today.year - 1
        else:
            return today.year


def photos(post: Post) -> list[str]:
    result = []
    for attachment in post.get("attachments", []):
        if attachment["type"] == "photo":
            photo = attachment["photo"]
            url = max(
                photo["sizes"],
                key=lambda s: s["width"] * s["height"]
            )["url"]
            result.append(url)
    return result

def event_from_post(community: str, post: Post) -> Event:
    return {
        "post_id": post["id"],
        "community": COMMUNITIES[community],
        "text": post["text"],
        "photos": photos(post)
    }

def add_posts(community: str, posts: list[Post], events: dict[int, dict[int, dict[int, list[Event]]]]):
    for post in posts:
        for date in detect_dates(post):
            if date.year == 0:
                date.year = guess_year(date, TODAY)
            year_events = events.setdefault(date.year, {})
            month_events = year_events.setdefault(date.month, {})
            day_events = month_events.setdefault(date.day, [])
            day_events.append(event_from_post(community, post))

events = {}
for community in COMMUNITIES:
    print(community)
    add_posts(community, load_community_posts(community), events)
with open("events.json", "w+", encoding="utf-8") as f:
    json.dump(events, f, ensure_ascii=False, indent="  ", sort_keys=True)
