const removePopup = new Event("de-activate");
document.addEventListener("DOMContentLoaded", () => {
  const calendarEl = document.getElementById("calendar");
  const calendar = new FullCalendar.Calendar(calendarEl, {
    dayMaxEventRows: true,
    views: {
      timeGrid: {
        dayMaxEventRows: 4,
      },
    },
    headerToolbar: {
      left: "dayGridMonth,timeGridWeek,timeGridDay,today",
      center: "title",
      right: "prevYear,prev,next,nextYear",
    },
    eventClick: function (info) {
      getApi().then((data) => {
        const ogg = data.find((elem) => elem.id == info.event._def.publicId);
        console.log(ogg)
        if (
          window.confirm(
            `Press OK to be redirected to the ${ogg.title.toUpperCase()} online page --- press CANCEL to stay`
          )
        ) {
          window.open(`${ogg.url}`,"_blank");
        }
      });
    },
  });
  getApi().then((data) =>
    data.forEach((element) => {
      calendar.addEvent({
        id: element.id,
        title: `${element.title}`,
        start: element.publishedAt,
        allDay: false,
        display: "list-item",
        backgroundColor: "#5865f2",
      });
    })
  );

  calendar.render();
});
