function generateQRCode() {
  const qrValue = "SESSION-" + new Date().getTime();
  localStorage.setItem("currentQR", qrValue);

  const qrContainer = document.getElementById("qrcode");
  qrContainer.innerHTML = "";
  new QRCode(qrContainer, {
    text: qrValue,
    width: 200,
    height: 200
  });
}
/*
  alert("✅ QR Code generated. Students can scan now!");
*/
