import { Selectors } from "./constants";
// @ts-ignore
import component from "../component.html";
import { BannerConfig, Channel, Region } from "../types/consentConfigs";
import { generateColorShades } from "./generateColorShades";

function minifyHTML(html: string) {
  return html
    // Remove HTML comments
    .replace(/<!--[\s\S]*?-->/g, '')
    // Remove whitespace between tags
    .replace(/>\s+</g, '><')
    // Collapse multiple spaces
    .replace(/\s{2,}/g, ' ')
    // Remove spaces around "=" in attributes
    .replace(/\s*=\s*/g, '=')
    // Remove leading/trailing spaces inside attribute values (after/before quotes)
    .replace(/="\s+/g, '="').replace(/\s+"/g, '"')
    // Trim text inside tags (between >text<)
    .replace(/>([^<]+)</g, (_, text) => `>${text.trim()}<`)
    .trim();
}

export function createShadowRoot()
{
  const shadowHost = document.createElement("div");
  document.body.appendChild(shadowHost);
  const shadowRoot = shadowHost.attachShadow({ mode: "open" });
  return shadowRoot;
}

export function injectCss(shadowRoot: ShadowRoot, styles: string)
{
  const style = document.createElement("style");
  style.id = Selectors.styleTagId;
  style.innerHTML = styles;
  shadowRoot.appendChild(style);
}

export type Tag = "div" | "button";

export function createElement({
  tag = "div",
  attributes = {},
  innerHtml = "",
}: {
  tag: Tag;
  attributes: { [key: string]: string };
  innerHtml: string;
})
{
  const element = document.createElement(tag);
  Object.entries(attributes).forEach(([key, value]) =>
  {
    element.setAttribute(key, value);
  });
  if (innerHtml) element.innerHTML = innerHtml;
  return element as HTMLElement;
}

export function mountConsentManager(shadowRoot: ShadowRoot)
{
  const overlay = createElement({
    tag: "div",
    attributes: {
      class: "_dv overlay",
      id: Selectors.mainElemId,
    },
    innerHtml: "",
  });

  const cm = createElement({
    tag: "div",
    attributes: {
      class: "__dv container",
      id: Selectors.containerId,
    },
    innerHtml: minifyHTML(component),
  });

  overlay.appendChild(cm);
  shadowRoot.appendChild(overlay);
}

export function renderComponents(
  shadowRoot: ShadowRoot,
  bannerConfigs: BannerConfig,
  regionData: Region,
  applyRegion: string
)
{
  const colorMap = generateColorShades(bannerConfigs.styles.primaryColor);

  // set switch colors
  const el = shadowRoot.host as HTMLElement;
  el.style.setProperty("--slider-on-color", colorMap["400"]);

  const bannerDescriptionContainers = shadowRoot.querySelectorAll(
    "div[data-identity=banner-description-container]"
  );

  bannerDescriptionContainers.forEach((el) =>
  {
    if (el instanceof HTMLElement) {
      // el.style.color = colorMap["500"];
      // el.style.backgroundColor = colorMap["10"];
    }
  });

  const bannerDescriptionTexts = shadowRoot.querySelectorAll(
    "span[data-identity=banner-description-text]"
  );

  bannerDescriptionTexts.forEach((el) =>
  {
    if (el instanceof HTMLElement) {
      el.innerHTML = regionData.privacy_notice.description["en"] + "<br />";
    }
  });

  // render all the buttons
  bannerConfigs.content.buttons.forEach((button) =>
  {
    const buttonElements = shadowRoot.querySelectorAll(
      `[data-identity=${button.action}]`
    ) as NodeListOf<HTMLElement>;

    if (buttonElements.length > 0) {
      buttonElements.forEach((buttonElement) =>
      {
        if (
          button.action === "configure_manually" ||
          button.action === "reject_all"
        ) {
          if (applyRegion === "global") {
            shadowRoot.querySelector(".__dv_action_info")?.remove();
            return buttonElement.remove();
          }
          if (buttonElement.id !== "close-btn-top") {
            /**
             * [1] If this condition is true, the button is "Configure Manually" button.
             * [2] For EU, this button click will open another menu that enables user to 
             *     choose cookies and their prefered channels.
             * [3] For USA, this button will act as "Don't Sell My Data" flag button. 
             */
            buttonElement.innerHTML =
              applyRegion === "eu" ? button.text["en"] : "Don't Sell My Data";
            if(applyRegion === "usa") {
              buttonElement.setAttribute("data-identity", "dont_sell_my_data");
            }
            buttonElement.style.backgroundColor = "transparent";
            buttonElement.style.color = colorMap["200"];
            buttonElement.style.border = `1px solid ${colorMap["200"]}`;
            // buttonElement.style.borderRadius = `${bannerConfigs.styles.borderRadius}px`;
            buttonElement.style.transition = "all 0.3s ease-in-out";
            // buttonElement.style.cursor = "pointer";

            buttonElement.addEventListener("mouseenter", () =>
            {
              buttonElement.style.backgroundColor = colorMap["200"];
              buttonElement.style.color = colorMap["10"]; // hover color
            });

            buttonElement.addEventListener("mouseleave", () =>
            {
              buttonElement.style.backgroundColor = "transparent";
              buttonElement.style.color = colorMap["200"];
            });
          }
        } else if (button.action === "privacy_policy_text") {
          buttonElement.innerText = button.text["en"];
          console.log(buttonElement);
          buttonElement.setAttribute(
            "href",
            regionData.privacy_notice.policy_url || '#'
          );
          buttonElement.setAttribute("target", "_blank");
        } else {
          buttonElement.innerHTML =
            applyRegion === "global" ? "Ok, I understand" : button.text["en"];
          buttonElement.style.backgroundColor = colorMap["200"];
          buttonElement.style.color = colorMap["10"];
        }
      });
    }
  });
}

export function renderChannels(
  shadowRoot: ShadowRoot,
  channels: Channel[],
  bannerConfigs: BannerConfig
)
{
  const channelListContainer = shadowRoot.querySelector(
    "div[data-identity=channel-list]"
  );

  const channelList = createElement({
    tag: "div",
    attributes: {
      class: "",
      id: "none",
    },
    innerHtml: "",
  });

  const colorMap = generateColorShades(bannerConfigs.styles.primaryColor);
  console.log("colorMap", colorMap);

  const channelItems = channels.map((channel) =>
  {
    const cookieNum =
      channel.vendors.reduce((prev, curr) =>
      {
        return (prev + curr.cookies.length) as number;
      }, 0) + channel.cookies.length;


    const channelsListComponent = `<div class="channel">
                <div class="header">
                    <p class="_dv_cookie_text" style="font-size: 14px">${channel.label["en"]
        } (${cookieNum} cookies)</p>
                <label class="dv_switch_input">
                  <input type="checkbox" name="${channel.name}" data-identity="channel_preferences" checked ${channel.is_essential ? "disabled" : ""}>
                  <span class="slider" style="${channel.is_essential ? "opacity: 70%; cursor: not-allowed; " : ""}"></span>
                </label>
                </div>
                <p class="_dv_cookie_text">
                    ${channel.description?.["en"]}
                </p>
                ${channel.vendors
          .map((vendor) =>
          {
            if (vendor.cookies.length === 0) return "";
            return `<div class="__dv_cookie_category_details">
                    <p class="_dv_cookie_text" style="font-size: 14px;">
                        ${vendor.name}
                    </p>
                    <a href="${vendor.privacy_policy_url
              }" target="_blank" class="_dv_cookie_policy" style="text-decoration: underline;">
                        Privacy Policy <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14"
                            fill="none">
                            <g id="arrow_outward">
                                <mask id="mask0_13941_19277" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="0" y="0"
                                    width="14" height="14">
                                    <rect id="Bounding box" x="0.492188" y="0.468018" width="13" height="13"
                                        fill="#D9D9D9" />
                                </mask>
                                <g mask="url(#mask0_13941_19277)">
                                    <path id="arrow_outward_2"
                                        d="M3.95755 10.2181L3.19922 9.45973L8.39922 4.25972H3.74089V3.17639H10.2409V9.67639H9.15755V5.01806L3.95755 10.2181Z"
                                        fill="#0F172A" />
                                </g>
                            </g>
                        </svg>
                    </a>
    
                    <p class="_dv_cookie_text">
                        ${vendor?.description?.["en"]}
                    </p>
                    ${vendor.cookies
                ?.map((cookie) =>
                {
                  return `<hr>
                    <p class="_dv_cookie_text" style="font-weight:600; ">${cookie.name}</p>
                    <p class="_dv_cookie_text">
                        ${cookie.description?.["en"]}
                    </p>
                    <div class="__dv_cookie_category_details_grid">
                        <div>
                            <p class="_dv_cookie_text">
                                Cookies Duration:
                            </p>
                            <p class="_dv_cookie_text">
                                ${cookie.expiration}
                            </p>
                        </div>
                        <div>
                            <p class="_dv_cookie_text">
                                Type:
                            </p>
                            <p class="_dv_cookie_text">
                                ${cookie.httpOnly ?? "Client Cookie"}
                            </p>
                        </div>
                    </div>`;
                })
                .join("")}
                </div>`;
          })
          .join("")}
                ${channel.cookies.length > 0
          ? `
                  <div class="__dv_cookie_category_details">
                      <p class="_dv_cookie_text" style="font-size: 14px; font-weight:500;">
                          Other Cookie
                      </p>
                      ${channel.cookies
            .map((cookie) =>
            {
              return `
                      <p class="_dv_cookie_text" style="color:  font-weight:600;">${cookie.name}</p>
                      <p class="_dv_cookie_text">
                          ${cookie.description?.["en"] ??
                "No cookie description found"
                }
                      </p>
                      <div class="__dv_cookie_category_details_grid">
                          <div>
                              <p class="_dv_cookie_text">
                                  Cookies Duration:
                              </p>
                              <p class="_dv_cookie_text">
                                  ${cookie.expiration}
                              </p>
                          </div>
                          <div>
                              <p class="_dv_cookie_text">
                                  Type:
                              </p>
                              <p class="_dv_cookie_text">
                                  ${cookie.httpOnly ?? "Client Cookie"}
                              </p>
                          </div>
                      </div>`;
            })
            .join("")}
                  </div>
                  `
          : ""
        }
            </div>`;

    return createElement({
      tag: "div",
      attributes: {
        class: "",
        id: "",
      },
      innerHtml: minifyHTML(channelsListComponent),
    });
  });

  channelList.append(...channelItems);

  channelListContainer?.appendChild(channelList);
}
