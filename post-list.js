const MONTHS = [
  "января",
  "февраля",
  "марта",
  "апреля",
  "мая",
  "июня",
  "июля",
  "августа",
  "сентября",
  "октября",
  "ноября",
  "декабря",
];

function showPosts(posts) {
  const main = document.querySelector("main");
  const sample = main.querySelector("#post-sample");
  for (const postEl of main.querySelectorAll(".post")) {
    if (postEl.id != "post-sample") {
      postEl.remove();
    }
  }
  for (const post of posts) {
    const postEl = sample.cloneNode(true);
    postEl.removeAttribute("id");
    postEl.removeAttribute("hidden");
    const dateEl = postEl.querySelector(".date");
    if (post.day !== undefined && post.month !== undefined) {
      dateEl.textContent = `${post.day} ${MONTHS[post.month - 1]}`;
    } else {
      dateEl.remove();
    }
    postEl.querySelector(".community-name").textContent = post.community_title;
    const photoEl = postEl.querySelector(".photo");
    if (post.photos.length == 0) {
      photoEl.remove();
    } else {
      let imgEl = photoEl.querySelector(".image");
      let backgroundEl = photoEl.querySelector(".background");
      function setImage(el, i) {
        const normI = (i + post.photos.length) % post.photos.length;
        el.setAttribute("src", post.photos[normI]);
      }
      let current = 0;
      setImage(imgEl, current);
      setImage(backgroundEl, current);
      const leftEl = photoEl.querySelector(".left");
      const rightEl = photoEl.querySelector(".right");
      if (post.photos.length == 1) {
        leftEl.remove();
        rightEl.remove();
      } else {
        function rotate(dir) {
          current += dir;
          if (current < 0) {
            current += post.photos.length;
          }
          if (current > post.photos.length) {
            current -= post.photos.length;
          }
          const imgCopy = imgEl.cloneNode();
          const backgroundCopy = backgroundEl.cloneNode();
          imgCopy.addEventListener(
            "load",
            () => {
              backgroundCopy.style.opacity = 0;
              photoEl.appendChild(imgCopy);
              photoEl.appendChild(backgroundCopy);
              imgEl.style.left = dir == -1 ? "100%" : "-0%";
              imgCopy.style.left = dir == -1 ? "-100%" : "100%";
              setTimeout(() => {
                imgCopy.style.left = "0%";
                imgEl.style.left = dir == -1 ? "100%" : "-100%";
                backgroundCopy.style.opacity = 1;
                backgroundEl.style.opacity = 0;
              }, 100);
              setTimeout(() => {
                imgEl.remove();
                imgEl = imgCopy;
                backgroundEl.remove();
                backgroundEl = backgroundCopy;
              }, 600);
            },
            { once: true },
          );
          setImage(imgCopy, current);
          setImage(backgroundCopy, current);
        }
        let hovered = false;

        setInterval(() => {
          if (!hovered) {
            rotate(+1);
          }
        }, 10000);

        photoEl.addEventListener("mouseenter", () => {
          hovered = true;
        });
        photoEl.addEventListener("mouseleave", () => {
          hovered = false;
        });
        leftEl.addEventListener("click", () => rotate(-1));
        rightEl.addEventListener("click", () => rotate(+1));
      }
    }
    postEl.querySelector("p").textContent = post.text;
    main.appendChild(postEl);
  }
}

// Пример использования
// если в календаре не выбран ни один день,
// следует передать первые 10 постов,
// и каждому прописать month и day
document.addEventListener("DOMContentLoaded", () => {
  showPosts([
    {
      community: "career.uust",
      community_title: "Центр карьеры",
      photos: [
        "https://sun9-12.userapi.com/s/v1/ig2/kVlCzXR6so3LYolrLg2gdUApZWEcoDeRl-E8AB6FKCYi5gBcynNIrBSBFx10BAblIzjxhtPza2g1EGguUffXaYR1.jpg?quality=95&as=32x21,48x32,72x48,108x72,160x106,240x160,360x239,480x319,540x359,640x426,720x479,1080x718,1280x851,1440x958,2560x1703&from=bu&cs=640x0",
        "https://sun9-66.userapi.com/s/v1/ig2/1P3ZfyZ0zI8Sa4fuVvE5S2sRhe6Kr1Le4XvqEIn6EDqJu_0d6NTg6ZGQ2FB5gPMNrgvLoUIjeXQUH5DtDGSz4UlR.jpg?quality=95&as=32x21,48x32,72x48,108x72,160x106,240x160,360x239,480x319,540x359,640x426,720x479,1080x718,1280x851,1440x958,2560x1703&from=bu&cs=640x0",
        "https://sun9-78.userapi.com/s/v1/ig2/YDj91Z_JzZvNAeDxMr2RoGfDxjggu4Ootrfe__WOWt4p4GkslNhkiocugrmDAkWZpK_38tkPCKqtCGtDVCACv7E9.jpg?quality=95&as=32x21,48x32,72x48,108x72,160x107,240x160,360x240,480x320,540x360,640x427,720x480,1080x720,1280x853,1440x960,2560x1707&from=bu&cs=640x0",
      ],
      post_id: 11378,
      text: "🍂 Осень в Образовательном центре «Сириус» \n \n⏰ Важные даты: \n— Последний день подачи заявок — 3 августа 2026 года \n— Заезд в Центр — ориентировочно 20 августа 2026 года \n \nМы предлагаем: \n✧ Официальное трудоустройство по трудовому договору \n✧ Проживание в комфортабельном гостиничном комплексе на побережье Черного моря (Федеральная территория «Сириус») \n✧ Гибкий сменный график работы \n✧ Конкурентную заработную плату: \n— Вожатый — 44 000 руб. (до вычета НДФЛ) \n— Дежурный администратор (ночной вожатый) — 43 000 (до вычета НДФЛ) \n— Старший вожатый — 55 000 руб. (до вычета НДФЛ) \n \nВаши задачи: \n📌 Сопровождать группу участников на протяжении всей интенсивной профильной программы \n📌 Обеспечивать безопасность детей как на территории кампуса, так и за его пределами \n📌 Контролировать соблюдение распорядка дня \n📌 Организовывать содержательный досуг: командные мероприятия и занятия в свободное от учёбы и тренировок время \n \nТребования к кандидатам: \n🎓 Вы — студент старших курсов или уже имеете оконченное образование (любого профиля подготовки) \n🎒 У вас есть педагогический опыт \n📅 Готовы к работе на период от 2 месяцев \n \n‼ Как принять участие? \n \nПерейдите по ссылке, зарегистрируйтесь и заполните заявку на платформе siriuskurator.ru \n \nЕсли вы рассматриваете более ранний заезд, свяжитесь с нами напрямую: \n→ vk.com/proskurin_artem \n→ vk.com/irina_kuratorr \n \nПрисоединяйтесь к команде, которая вдохновляет будущее!",
    },
    {
      community: "uustufa",
      community_title: "УУНиТ",
      photos: [
        "https://sun9-56.userapi.com/s/v1/ig2/4Tnd4WpS5RW_5fMFnCHpfXL8k4zuR1zdZuqOS4OKuFl2AJvzswOtTjSKIv5qsRXLEmiIzY9NrsBOjU368yn_FB58.jpg?quality=95&as=32x32,48x48,72x72,108x108,160x160,240x240,360x360,480x480,540x540,640x640,720x720,1080x1080,1280x1280,1440x1440,2000x2000&from=bu&cs=2000x0",
      ],
      post_id: 187116,
      text: "⏳ Уже завтра завершается прием согласий на зачисление на программы бакалавриата и специалитета по основному этапу!\n\n📌До 5 августа, 14:00 необходимо подать согласие на зачисление, если поступаешь на бюджет.\n✨А уже 7 августа будут опубликованы приказы о зачислении.\n\nПроверь, что все готово, и успей подтвердить свой выбор: https://uust.ru/admission/\n\nЖдете приказы? 👇\n🔥— очень волнуюсь\n❤️— согласие уже подал, жду результаты\n🎉— совсем скоро стану студентом УУНиТ!",
    },
  ]);
});
