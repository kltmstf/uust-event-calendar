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
          setImage(imgCopy, current);
          setImage(backgroundCopy, current);
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
        }
        let hovered = false;

        setInterval(() => {
          if (!hovered) {
            rotate(+1);
          }
        }, 5000);

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
      community: "uustufa",
      community_title: "УУНиТ",
      photos: [
        "https://sun9-56.userapi.com/s/v1/ig2/4Tnd4WpS5RW_5fMFnCHpfXL8k4zuR1zdZuqOS4OKuFl2AJvzswOtTjSKIv5qsRXLEmiIzY9NrsBOjU368yn_FB58.jpg?quality=95&as=32x32,48x48,72x72,108x108,160x160,240x240,360x360,480x480,540x540,640x640,720x720,1080x1080,1280x1280,1440x1440,2000x2000&from=bu&cs=2000x0",
        "https://sun9-54.userapi.com/s/v1/ig2/OjfHliNWIldmBi6WsUhRVKYVkny_QPpZpEJBAWI_pkNCAf7Nbap7msduXMTYebtm04JuO2sInniVnwnGKuxLT_y3.jpg?quality=95&as=32x32,48x48,72x72,108x108,160x160,240x240,360x360,480x480,540x540,640x640,720x720,1080x1080,1179x1179&from=bu&cs=1179x0",
        "https://sun9-84.userapi.com/s/v1/ig2/Dyh4qW18OyIejCcmq8MRQbEcGSczyByAiRLhNreyUJCClt6cU77-f2mUYT9b3c6x2fPYJ0JtMyyp_4bNmxtNm7JG.jpg?quality=95&crop=0,0,2560,1440&as=32x18,48x27,72x40,108x61,160x90,240x135,360x202,480x270,540x304,640x360,720x405,1080x607,1280x720,1440x810,2560x1440&from=bu&cs=2560x0",
      ],
      post_id: 191332,
      text: "🎓Сегодня тот самый день!\n\n7 августа до 23:59 (МСК) будут опубликованы приказы о зачислении на бюджет в рамках основного этапа на программы бакалавриата и специалитета.\n\nПроверить приказы можно по ссылке: https://uust.ru/admission/bachelor-and-specialist/enrollment-orders/2026/?ysclid=msd12c61zw281888449\n\nКак проходит ваше ожидание?\n❤️ Жду спокойно ⚡️Обновляю сайт каждые 5 минут 🔥 Уже чувствую себя студентом",
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
