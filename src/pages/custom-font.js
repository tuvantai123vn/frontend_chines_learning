// custom-font.js
import { jsPDF } from "jspdf";

// Đây là font base64 đã convert (chỉ ví dụ, bạn nên dùng file của riêng bạn)
const robotoNormal = "AAEAAAASAQAABAAgR0RFRrRCsIIAA..."

jsPDF.API.events.push([
  "addFonts",
  function () {
    this.addFileToVFS("Roboto-Regular.ttf", robotoNormal);
    this.addFont("Roboto-Regular.ttf", "Roboto", "normal");
  },
]);
