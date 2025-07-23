// @ts-ignore
import styles from "./consent-manager.module.css";
import { ConsentManagerConfig } from "./types/consentConfigs";
import { Selectors } from "./utils/constants";
import { handleConsents, hideConsentBanner } from "./utils/handleConsents";
import {
  createShadowRoot,
  injectCss,
  mountConsentManager,
  renderChannels,
  renderComponents,
} from "./utils/renderUi";

export interface ConsentType {
  explicitConsent: boolean;
  consents: {
    strictly_necessary: boolean;
    performance: boolean;
    targeting: boolean;
    functional: boolean;
    social_media: boolean;
  };
  region: "global" | "usa" | "eu";
  user_id?: string;
}

declare global {
  interface Window {
    ConsentManagerSDK: any;
    datacops: (type: string, data: any) => void;
    onConsentGiven: (props: ConsentType) => void;
  }
}

function disableScroll() {
  document.body.style.overflowX = "hidden";
}

function attachEventListeners(
  document: ShadowRoot,
  applyRegion: "usa" | "eu" | "global",
  consentChoises: any
) {
  const consentManager = document.getElementById(
    Selectors.mainElemId
  ) as HTMLElement;

  // DELEGATE ALL CLICK EVENTS
  consentManager.addEventListener("click", (e) => {
    const clickedElement = e.target as HTMLElement;
    // TOP CLOSE BUTTON & ALL ACTION BUTTONS
    if (
      clickedElement.closest("button")?.id === Selectors.topCloseBtnId ||
      clickedElement.closest("button")?.dataset.buttonrole ===
        Selectors.allActionBtn
    ) {
      handleConsents(
        consentManager,
        consentChoises,
        clickedElement,
        applyRegion
      );
    }
    // CONFIGURE MANUALLY BUTTON
    else if (
      clickedElement.closest("button")?.id === Selectors.customizeBtnId
    ) {
      /**
       * [1] Configure Manually Button acts as Don't Sell My Data button for US Region.
       * [2] Mark usa:DSD as true for future use
       * [3] Also send this data to Main Script.
       */
      if (applyRegion === "usa") {
        localStorage.setItem("usa:DSD", "true");
        return hideConsentBanner(consentManager);
      }

      /**
       * [1] For EU users it is Configure Manually button.
       */

      const customizeBtn = clickedElement.closest(
        `#${Selectors.customizeBtnId}`
      ) as HTMLElement;

      const detailsDiv = document.getElementById(
        Selectors.customizeDetailsId
      ) as HTMLElement;
      
      const noticeDiv = document.getElementById(
        Selectors.noticeContainerId
      ) as HTMLElement;
      const containerDiv = document.getElementById(
        Selectors.containerId
      ) as HTMLElement;

      const configureManuallyBtns = document.getElementById(
        "configure_manually_btns"
      ) as HTMLElement;

      if (customizeBtn.getAttribute("data-state") !== "shown") {
        customizeBtn.setAttribute("data-state", "shown");
        customizeBtn.innerText = "Hide details";
        detailsDiv.style.display = "flex";
        noticeDiv.style.display = "none";
        containerDiv.classList.add("__dv_vertical");
        configureManuallyBtns.style.display = "flex";
        return;
      }
      customizeBtn.innerText = "Customize Settings";
      detailsDiv.style.display = "none";
      noticeDiv.style.display = "block";
      containerDiv.classList.remove("__dv_vertical");
      configureManuallyBtns.style.display = "none";
      customizeBtn.setAttribute("data-state", "hidden");
    }
  });

  // DELEGATE ALL SWITCH EVENTS
  consentManager.addEventListener("change", (e) => {
    const target = e.target as HTMLInputElement;

    if (target && target.type === "checkbox") {
      consentChoises = {
        ...consentChoises,
        [target.name]: target.checked,
      };
    }
  });
}

function showConsentManager(config: ConsentManagerConfig, consentChoises: any) {
  disableScroll();
  const shadowRoot = createShadowRoot();
  injectCss(shadowRoot, styles);
  mountConsentManager(shadowRoot);
  renderComponents(
    shadowRoot,
    config.banner_config,
    config.regions[config.applyRegion],
    config.applyRegion
  );
  renderChannels(shadowRoot, config.channels, config.banner_config);
  attachEventListeners(shadowRoot, config.applyRegion, consentChoises);
}

/**
 * Consent Manager SDK
 * Provides functionality to manage user consent for data processing
 */
const ConsentManagerSDK = (function () {
  // Private variables
  let config: ConsentManagerConfig;
  let consentChoices = {};

  // Private methods
  function renderConsentUI() {
    // SHOW THE CONSENT MANAGER
    showConsentManager(config, consentChoices);
  }

  // Public API
  return {
    init(options: ConsentManagerConfig) {
      // Validate and store configuration
      if (!options) {
        throw new Error("Consent Manager SDK: Configuration is required");
      }
      config = options;
      consentChoices = Object.fromEntries(
        options.channels.map((item) => [item.name, true])
      );
      renderConsentUI();
    },
  };
})();

// Expose to global scope
window.ConsentManagerSDK = ConsentManagerSDK;
