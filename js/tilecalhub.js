const shapes = {
  square: ["Straight","Offset","Diamond","Basket Weave","Pinwheel"],
  rectangle: ["Straight","Offset","Herringbone","Chevron","Stack Bond","Pinwheel"],
  plank: ["Straight","Herringbone","Chevron","Random","Staggered"]
};

const shapeSel = document.getElementById("tileShape");
Object.keys(shapes).forEach(key => {
  const opt = document.createElement("option");
  opt.value = key; opt.textContent = key.charAt(0).toUpperCase() + key.slice(1);
  shapeSel.appendChild(opt);
});

shapeSel.addEventListener("change", () => {
  const gall = document.getElementById("patternGallery");
  gall.innerHTML = "";
  const list = shapes[shapeSel.value];
  list.forEach(name => {
    const img = document.createElement("img");
    const fname = name.toLowerCase().replace(/\s+/g,"-");
    img.src = `images/${shapeSel.value}-${fname}.jpg`;
    img.alt = name;
    img.className = "w-full h-auto rounded border hover:shadow-lg cursor-pointer";

    const label = document.createElement("div");
    label.textContent = name;
    label.className = "text-center mt-1 text-sm";

    const cell = document.createElement("div");
    cell.append(img,label);
    cell.onclick = () => {
      document.querySelectorAll("#patternGallery img").forEach(i=>i.classList.remove("ring","ring-blue-500"));
      img.classList.add("ring","ring-blue-500");
      localStorage.setItem("layoutPattern",fname);
    };
    gall.appendChild(cell);
  });
});

function calculateTiles(){
  const roomL = parseFloat(document.getElementById("roomLength").value);
  const roomW = parseFloat(document.getElementById("roomWidth").value);
  const tileL = parseFloat(document.getElementById("tileLength").value);
  const tileW = parseFloat(document.getElementById("tileWidth").value);
  const buffer = parseFloat(document.getElementById("buffer").value);
  const unit = document.getElementById("unitSelect").value;
  const shape = shapeSel.value;
  const pattern = localStorage.getItem("layoutPattern")||"straight";

  const total = Math.ceil((roomL*roomW)/(tileL*tileW));
  const withBuf = Math.ceil(total*(1+buffer/100));

  localStorage.setItem("roomLength", roomL);
  localStorage.setItem("roomWidth", roomW);
  localStorage.setItem("tileLength", tileL);
  localStorage.setItem("tileWidth", tileW);
  localStorage.setItem("unit", unit);
  localStorage.setItem("tileShape", shape);

  document.getElementById("result").innerHTML = `
    <p>Total Tiles Needed: <strong>${total}</strong></p>
    <p>With Buffer: <strong>${withBuf}</strong></p>
  `;
  document.getElementById("previewBtn").classList.remove("hidden");
}

function goToPreview(){
  window.location.href = "layout-preview.html";
}

shapeSel.dispatchEvent(new Event("change"));
