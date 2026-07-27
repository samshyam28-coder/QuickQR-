/* ==========================================================================
   QUICKQR - CLIENT-SIDE LOGIC
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
  // --- 1. DOM ELEMENTS ---
  const tabButtons = document.querySelectorAll(".tab-btn");
  const tabContents = document.querySelectorAll(".input-tab-content");

  // Inputs
  const urlInput = document.getElementById("url-input");
  const textInput = document.getElementById("text-input");
  const wifiSsid = document.getElementById("wifi-ssid");
  const wifiPassword = document.getElementById("wifi-password");
  const wifiEncryption = document.getElementById("wifi-encryption");

  // Customization Controls
  const colorFgInput = document.getElementById("color-fg");
  const colorBgInput = document.getElementById("color-bg");
  const hexFgSpan = document.getElementById("hex-fg");
  const hexBgSpan = document.getElementById("hex-bg");
  const qrSizeInput = document.getElementById("qr-size");
  const sizeValueSpan = document.getElementById("size-value");

  // Canvas Wrapper & Buttons
  const qrWrapper = document.getElementById("qr-canvas-wrapper");
  const btnDownloadPng = document.getElementById("btn-download-png");
  const btnDownloadSvg = document.getElementById("btn-download-svg");

  // Active Tab Tracker ('url' | 'text' | 'wifi')
  let activeTab = "url";

  // --- 2. INITIALIZE QR CODE STYLING INSTANCE ---
  const qrCode = new QRCodeStyling({
    width: 300,
    height: 300,
    type: "svg", // Renders clean vector directly to DOM
    data: "https://example.com",
    dotsOptions: {
      color: "#000000",
      type: "square",
    },
    backgroundOptions: {
      color: "#ffffff",
    },
    imageOptions: {
      crossOrigin: "anonymous",
      margin: 10,
    },
  });

  // Append generated QR code inside our preview box
  qrCode.append(qrWrapper);

  // --- 3. HELPER FUNCTIONS ---

  /**
   * Constructs the string data depending on the selected tab
   */
  function getQRData() {
    if (activeTab === "url") {
      return urlInput.value.trim() || "https://example.com";
    }

    if (activeTab === "text") {
      return textInput.value.trim() || "Sample Text";
    }

    if (activeTab === "wifi") {
      const ssid = wifiSsid.value.trim();
      const password = wifiPassword.value;
      const encryption = wifiEncryption.value;

      if (!ssid) return "WIFI:S:MyNetwork;T:WPA;P:password;;"; // Fallback default

      // Standard Wi-Fi QR formatting spec
      // WIFI:T:WPA;S:mynetwork;P:mypass;;
      return `WIFI:T:${encryption};S:${ssid};P:${password};;`;
    }

    return "https://example.com";
  }

  /**
   * Reads all current user choices and updates the live QR code
   */
  function updateQRCode() {
    const data = getQRData();
    const size = parseInt(qrSizeInput.value, 10);
    const fgColor = colorFgInput.value;
    const bgColor = colorBgInput.value;

    // Update displayed hex labels
    hexFgSpan.textContent = fgColor.toUpperCase();
    hexBgSpan.textContent = bgColor.toUpperCase();
    sizeValueSpan.textContent = `${size}x${size} px`;

    // Update QR instance settings live
    qrCode.update({
      width: size,
      height: size,
      data: data,
      dotsOptions: {
        color: fgColor,
      },
      backgroundOptions: {
        color: bgColor,
      },
    });
  }

  // --- 4. EVENT LISTENERS ---

  // Tab Switching
  tabButtons.forEach((button) => {
    button.addEventListener("click", () => {
      // Deactivate all tabs
      tabButtons.forEach((btn) => btn.classList.remove("active"));
      tabContents.forEach((content) => content.classList.remove("active"));

      // Activate clicked tab
      button.classList.add("active");
      activeTab = button.getAttribute("data-tab");

      const targetContent = document.getElementById(`tab-${activeTab}`);
      if (targetContent) {
        targetContent.classList.add("active");
      }

      // Re-render live code for new tab settings
      updateQRCode();
    });
  });

  // Input Listeners (Real-time update on keypress/change)
  const allInputs = [
    urlInput,
    textInput,
    wifiSsid,
    wifiPassword,
    wifiEncryption,
    colorFgInput,
    colorBgInput,
    qrSizeInput,
  ];

  allInputs.forEach((input) => {
    input.addEventListener("input", updateQRCode);
  });

  // Download Actions
  btnDownloadPng.addEventListener("click", () => {
    qrCode.download({
      name: "quickqr-code",
      extension: "png",
    });
  });

  btnDownloadSvg.addEventListener("click", () => {
    qrCode.download({
      name: "quickqr-code",
      extension: "svg",
    });
  });

  // Run initial render on page load
  updateQRCode();
});