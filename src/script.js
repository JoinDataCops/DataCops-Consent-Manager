const customizeBtn = document.getElementById("customize-btn");
const detailsDiv = document.getElementById("consent-details");

customizeBtn.addEventListener("click", () => {
  if (customizeBtn.getAttribute("data-state") !== "shown") {
    customizeBtn.setAttribute("data-state", "shown");
    customizeBtn.innerText = "Hide details";
    detailsDiv.style.display = "block";
    return;
  }
  customizeBtn.innerText = "Customize Settings";
  detailsDiv.style.display = "none";
  customizeBtn.setAttribute("data-state", "hidden");
});

let tdcScope = window.tdcScope || [];

tdcScope.push({
  type: "consent.changed",
  data: {
    consent: {
      analytics: true,
      advertising: true,
    },
  },
});

function closeConsentManager() {
  const consentManager = document.getElementById("__dv_consent_manager");
  consentManager.remove();
}

let consents = [];

function acceptAll() {
  closeConsentManager();
}

function rejectAll() {
  closeConsentManager();
}

function saveConsents() {
  // DO ACTIONS FOR SAVING CONSENTS

  // Close the consent manager
  closeConsentManager();
}
