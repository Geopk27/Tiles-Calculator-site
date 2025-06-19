const canvas = document.getElementById("tileCanvas");
const ctx = canvas.getContext("2d");

const rawRoomLength = parseFloat(localStorage.getItem("roomLength"));
const rawRoomWidth  = parseFloat(localStorage.getItem("roomWidth"));
const rawTileLength = parseFloat(localStorage.getItem("tileLength"));
const rawTileWidth  = parseFloat(localStorage.getItem("tileWidth"));
const layoutPattern = localStorage.getItem("layoutPattern") || "straight";
const unit          = localStorage.getItem("unit") || "mm";

function convert(v,u){
  if(u==="cm") return v/10;
  if(u==="inch") return v/25.4;
  return v;
}

function drawCanvas(){
  const cw=canvas.width, ch=canvas.height;
  const roomL=convert(rawRoomLength,unit),
        roomW=convert(rawRoomWidth,unit),
        tileL=convert(rawTileLength,unit),
        tileW=convert(rawTileWidth,unit);

  const scaleX = cw*0.75/roomL,
        scaleY = ch*0.75/roomW,
        offX = cw*0.125,
        offY = ch*0.125;

  const tilesX=Math.floor(roomL/tileL),
        tilesY=Math.floor(roomW/tileW);
  let num=1;

  const overX = tileL*tilesX>roomL,
        overY = tileW*tilesY>roomW,
        overflow = overX||overY;

  ctx.clearRect(0,0,cw,ch);
  ctx.strokeStyle = overflow ? "red" : "black";
  ctx.strokeRect(offX, offY, roomL*scaleX, roomW*scaleY);

  ctx.font="12px Arial"; ctx.fillStyle="#000";
  ctx.fillText(`Area: ${rawRoomLength}${unit} x ${rawRoomWidth}${unit}`, offX+10, offY-10);

  function drawStraight(){ for(let y=0;y<tilesY;y++){ for(let x=0;x<tilesX;x++){ const px=offX+x*tileL*scaleX, py=offY+y*tileW*scaleY, w=tileL*scaleX, h=tileW*scaleY; ctx.strokeRect(px,py,w,h); ctx.fillText(num++, px+w/2-5, py+h/2+4); }}}
  function drawOffset(){ for(let y=0;y<tilesY;y++){ const o=(y%2)*tileL*scaleX/2; for(let x=0;x<tilesX;x++){ const px=offX+x*tileL*scaleX+o, py=offY+y*tileW*scaleY, w=tileL*scaleX, h=tileW*scaleY; ctx.strokeRect(px,py,w,h); ctx.fillText(num++, px+w/2-5, py+h/2+4); }}}
  function drawDiagonal(){ for(let y=0;y<tilesY;y++){ for(let x=0;x<tilesX;x++){ ctx.save(); const px=offX+x*tileL*scaleX, py=offY+y*tileW*scaleY; ctx.translate(px+tileL*scaleX/2, py+tileW*scaleY/2); ctx.rotate(Math.PI/4); ctx.strokeRect(-tileL*scaleX/2, -tileW*scaleY/2, tileL*scaleX, tileW*scaleY); ctx.fillText(num++, -5,4); ctx.restore(); }}}
  function drawHerringbone(){ const tL=tileL*scaleX, tW=tileW*scaleY; for(let y=0;y<tilesY;y++){ for(let x=0;x<tilesX;x++){ const px=offX+x*tW, py=offY+y*tL; ctx.save(); ctx.translate(px,py); if((x+y)%2===0){ ctx.rotate(Math.PI/2); ctx.strokeRect(0,0,tL,tW); ctx.fillText(num++, tL/2-5, tW/2+4);} else{ ctx.strokeRect(0,0,tW,tL); ctx.fillText(num++, tW/2-5, tL/2+4);} ctx.restore(); }}}

  if(layoutPattern==="straight") drawStraight();
  else if(layoutPattern==="offset") drawOffset();
  else if(layoutPattern==="diagonal") drawDiagonal();
  else if(layoutPattern==="herringbone") drawHerringbone();

  ctx.font="bold 11px Arial";
  ctx.fillText(`Scale 1:${Math.floor(250/(roomL/1000))} (${unit})`, 10, ch-10);
}

function downloadPDF(){
  const { jsPDF } = window.jspdf;
  const orient=document.getElementById("orientationSelect").value;
  const pdf=new jsPDF(orient,"mm","a4");
  const img=canvas.toDataURL("image/png");
  const w=210-20, h=w*(canvas.height/canvas.width);
  pdf.setFontSize(11);
  pdf.text("Tiles Code: ____________________",15,15);
  pdf.text("Location Area: __________________",110,15);
  pdf.addImage(img,"PNG",15,25,w,h);
  pdf.setFontSize(10);
  pdf.text(`Scale 1:${Math.floor(250/(convert(rawRoomLength,unit)/1000))} (${unit})`,15,25+h+8);
  pdf.text("www.tilecalhub.com",200,290,{align:"right"});
  pdf.save("tile-layout-plan.pdf");
}

window.onload = drawCanvas;
