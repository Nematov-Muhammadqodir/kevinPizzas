console.log("Products frontend javascript file");
$(function () {
  //DOCUMENT READY SYNTAX
  $(".product-collection").on("change", function () {
    if (this.value === "DRINK") {
      $("#product-collection").hide();
      $("#product-volume").show();
    } else {
      $("#product-collection").show();
      $("#product-volume").hide();
    }
  });

  $("#process-btn").on("click", () => {
    $(".dish-container").slideToggle(500);
    $("#process-btn").css("display", "none");
  });

  $("#cancel-btn").on("click", () => {
    $(".dish-container").slideToggle(100);
    $("#process-btn").css("display", "flex");
  });

  $(".new-product-status").on("change", async function (e) {
    const id = e.target.id;
    const productStatus = $(`#${id}.new-product-status`).val();
    try {
      const response = await axios.post(`/admin/product/${id}`, {
        productStatus: productStatus,
      });
      const result = response.data;
      if (result.data) {
        console.log("Product updated!");
        $(".new-product-status").blur();
      } else {
        alert("Product update failed!");
      }
    } catch (err) {
      console.log(err);
      alert("Product update failed!");
    }
  });
});

function validateForm() {
  const productName = $(".product-name").val();
  const productPrice = $(".product-price").val();
  const productLeftCount = $(".product-left-count").val();
  const productCollection = $(".product-collection").val();
  const productDesc = $(".product-desc").val();
  const productStatus = $(".product-status").val();
  const productIngredients = $(".product-inredients").val();

  if (
    productName === "" ||
    productPrice === "" ||
    productLeftCount === "" ||
    productCollection === "" ||
    productDesc === "" ||
    productStatus === "" ||
    productIngredients === ""
  ) {
    alert("Please insert all details");
    return false;
  } else {
    return true;
  }
}

function previewFileHandler(input, order) {
  const imgClassName = input.className;
  //   console.log("imgClassName", imgClassName);

  //   const file = document.querySelector(`.${imgClassName}`);
  //   console.log("ozimiziki", document.querySelector(`.${imgClassName}`));

  const file = $(`.${imgClassName}`).get(0).files[0];

  //   console.log("uploaded file", file);
  console.log(file);

  const fileType = file["type"];

  console.log(fileType);

  const validImageType = ["image/jpg", "image/jpeg", "image/png", "image/webp"];

  if (!validImageType.includes(fileType)) {
    alert(
      `Please insert only ${validImageType
        .map((el) => el.replace("image/", " "))
        .join(", ")}!`
    );
  } else {
    if (file) {
      const reader = new FileReader();
      reader.onload = function () {
        $(`#image-section-${order}`).attr("src", reader.result);
      };
      reader.readAsDataURL(file);
    }
  }
}
//animation

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
