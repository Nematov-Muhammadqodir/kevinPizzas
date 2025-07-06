console.log("Users frontend javascript file");
$(function () {
  $(".member-status").on("change", function (e) {
    const id = e.target.id;

    const memberStatus = $(`#${id}.member-status`).val();

    //TODO AXIOS updateChosenUser
    axios
      .post("/admin/user/edit", {
        _id: id,
        memberStatus: memberStatus,
      })
      .then((response) => {
        console.log("response", response.data);
        const result = response.data;
        if (result) {
          console.log("User updated!", result);
          $(".member-status").blur();
          alert("User updated!");
        } else {
          console.log(err);
          alert("User update failed!");
        }
      })
      .catch((err) => {
        console.log(err);
        alert("User update failed!");
      });
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const COUNT = 32;
  const SPIN_DURATION = 3.2;
  const svg = document.getElementById("harmonics");

  function createPath() {
    const startX = 0;
    const startY = 10;
    const width = 100;
    const height = 10;
    const points = 10;

    let pathUp = `M ${startX} ${startY} `;
    let pathDown = `M ${startX} ${startY} `;

    for (let i = 1; i <= points; i++) {
      const x = (width / points) * i;
      const isEven = i % 2 === 0;
      const cp1Y = startY + (isEven ? -height / 3 : height / 3);
      const cp2Y = startY + (isEven ? height / 3 : -height / 3);

      pathUp += `Q ${x - width / (points * 2)} ${cp1Y}, ${x} ${startY} `;
      pathDown += `Q ${x - width / (points * 2)} ${cp2Y}, ${x} ${startY} `;
    }
    return { pathUp, pathDown };
  }

  for (let i = 1; i <= COUNT; i++) {
    const { pathUp, pathDown } = createPath();
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("d", pathUp);
    path.style.strokeWidth = 0.02 + i * 0.002;
    path.style.stroke = `rgba(238, 238, 238, ${0.03 + (i / COUNT) * 0.3})`;
    path.style.fill = "none";

    const animate = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "animate"
    );
    animate.setAttribute("attributeName", "d");
    animate.setAttribute("values", `${pathDown};${pathUp};${pathDown}`);
    animate.setAttribute("dur", `${SPIN_DURATION + i * 0.1}s`);
    animate.setAttribute("repeatCount", "indefinite");
    path.appendChild(animate);

    svg.appendChild(path);
  }
});
