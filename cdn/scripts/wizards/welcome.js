import { CustomElement } from "../base.js";
import { MakeToast } from "../utils/make_toast.js";
import { IS_LOCAL } from "../globals.js";
import { DOMAIN_SEARCH, DOMAIN_REGISTRATION, DOMAIN_CONNECT } from "../urls.js";

import { modalBuilder } from "../modals/base.js";
import { SetDocumentEditable, UnsetDocumentEditable, SetLoading, UnsetLoading, dispatch } from "../interfaces/events.js";

// old content startfold
const HELP_CONTENT = `
<h3>It's 2025, and making a website should be easy!</h3>
<p>If you're just getting started, click the gray boxes to learn how to build a website.</p>
<ul>
  <li>
    <details class="tdw-help-menu" name="instructions-details">
    <summary><h3>EVERYTHING is click to change<h3></summary>
    <p>To change any text or picture, just click on it!</p>
    <img src="/cdn/assets/click_to_edit.gif">
    </details>
  </li>
  <li>
    <details class="tdw-help-menu" name="instructions-details">
    <summary><h3>Start by setting your Colors</h3></summary>
    <p>Our photo search finds pictures that match your colors, so pick your colors first!</p>
    <img src="/cdn/assets/edit_colors.gif">
    </details>
  </li>
  <li>
  <details class="tdw-help-menu" name="instructions-details">
  <summary><h3>Gray Buttons control Sections</h3></summary>
    <p>When you move your mouse over a section, gray buttons will show up. These buttons let you add, remove, or change the section.</p>
    <br />
    <ul>
        <li><strong>Left and Right (< and >)</strong> change how the section looks.</li>
        <li><strong>Add (+)</strong> lets you add a new section.</li>
        <li><strong>Up and Down (^ and v)</strong> move the section up or down.</li>
        <li><strong>Delete (x)</strong> lets you remove the section.</li>
    </ul>
    <img src="/cdn/assets/gray_buttons.gif">
    </details>
  </li>
  <li>
    <details class="tdw-help-menu" name="instructions-details">
    <summary><h3>Blue Buttons control Elements</h3></summary>
    <p>Some sections, like "about," can have different numbers of elements inside them. For these sections, Blue Buttons will show up when you move your mouse over an element. These buttons help you change the element, just like the Gray Buttons help you change sections.</p>
    <br />
    <ul>
      <li><strong>Up and Down (^ and v)</strong> move the element up or down.</li>
      <li><strong>Add (+)</strong> makes a copy of the element, so you can change it.</li>
      <li><strong>Remove (x)</strong> lets you delete the element.</li>
    </ul>
    <img src="/cdn/assets/blue_buttons.gif">
    </details>
  </li>
  <li>
    <details class="tdw-help-menu" name="instructions-details">
    <summary><h3>Use the Side Panel</h3></summary>
    <p>You can find the help menu in the side panel, along with options to change fonts, your site icon, site title, and more.</p>
    <img src="/cdn/assets/get_help.gif">
    </details>
  </li>
</ul>
<hr />
`
const AI_CONTENT = `
<p> If you want AI to generate the layout of your site and organize your content for you, tell us about your business and click GENERATE! Make sure to include as much detail as you can.</p>
<details class="ai-generation-instructions" name="instructions-details">
  <summary><h3 style="display: inline;">What should I tell the AI?</h3></summary>
  <ul class="ai-prompt-list">
      <li>Who are you?</li>
      <li>How long have you been around?</li>
      <li>What areas do you serve? (IMPORTANT FOR SEO)</li>
      <li>What key words or phrases would your customers or audience search in google to find you? (IMPORTANT FOR SEO)</li>
      <li>What do you do that makes you different?</li>
      <li>Who are your primary customers or audience?</li>
      <li>How can your customers get in contact with you?</li>
      <li>Do you have any testimonials, awards, or certifications that set you apart</li>
      <li>Are there any frequently asked questions that your customers have?</li>
  </ul> 
</details>
<textarea id="user-ai-description" placeholder="Tell the AI about your site, and let's get started!" oninput="this.style.height=this.scrollHeight + 'px'"></textarea>
`

async function runAIGeneration() {
        const promptContent = document.getElementById("user-ai-description");
        if (promptContent == null) {
            dispatch(SetDocumentEditable);        
            return;
        }
        dispatch(SetLoading);
        dispatch(UnsetDocumentEditable);
        const resp = await fetch("/sandbox/ai", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ "prompt": promptContent.value })
        })
        try {
            const data = await resp.json();
            console.log(data.prompt);
            window.loadSectionsFromJSON(data.sections);
            window.loadMetadataFromJSON(data.metadata);
            dispatch(SetDocumentEditable);
            dispatch(UnsetLoading);
        } catch (error) {
            console.error(error);
        }
}

export function showWelcomeModal() {
    let CONTENT = HELP_CONTENT;
    let cancelText = "Okay, got it.";
    let actionText = "Continue";
    const sectionCount = document.querySelectorAll("main section").length;
    if (sectionCount <= 1) {
        CONTENT += AI_CONTENT;
        cancelText = "Continue Without AI";
        actionText = "GENERATE!";
    }
    modalBuilder()
      .setHeaderText("Welcome To One Hour Website")
      .addClass("welcome-modal")
      .contentHTML(CONTENT)
      .setActionText(actionText)
      .actionFunc(runAIGeneration)
      .setCancelText(cancelText)
      .cancelFunc(() => {
        dispatch(SetDocumentEditable);        
        dispatch(UnsetLoading);
      })
      .showMe();
}
// endfold

class GenerationManager { // startfold
    constructor() {}
    generate(userPrompt) {
        console.log(userPrompt);
        this.generationComplete = false;
        this._generate(userPrompt);
    }
    async _generate(promptContent) {
        if (promptContent == null) {
            dispatch(SetDocumentEditable);        
            return;
        }
        const resp = await fetch("/sandbox/ai", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ "prompt": promptContent })
        })
        try {
            const data = await resp.json();
            window.loadSectionsFromJSON(data.sections);
            window.loadMetadataFromJSON(data.metadata);
        } catch (error) {
            console.error(error);
        }
        this.generationComplete = true;
        dispatch(SetDocumentEditable);
        dispatch(UnsetLoading);
    }
} // endfold
export class StartBuilding extends CustomElement { // startfold
    h2 = "... and you're in!";
    h1 = "Let's start building";
    ctaButtonText = "START SETUP";
    smallText = "No thanks.";
    ghostButtonText = "Take me to my account.";

    constructor(nav) {
        super();
        this.nav = nav;
        this.attachHTML(`
            <h2 class="adm-header adm-breadcrumb">${this.h2}</h2>
            <h1 class="adm-header adm-descriptive-cta">${this.h1}</h1>
            <button class="admin-btn adm-cta-btn" data-on-click="next">${this.ctaButtonText}</button>
            <small class="adm-small inline-text">
                ${this.smallText}
                <button class="admin-btn adm-ghost-btn" data-on-click="toAccount">${this.ghostButtonText}</button>
            </small>
        `);
    }
    toAccount(e) {
      e.preventDefault();
      window.location.href = "/account";
    }
    next(e) {
      e.preventDefault();
      this.nav("registerDomain");
    }
}
customElements.define("start-building", StartBuilding);
// endfold
export class StartupRegisterDomain extends CustomElement { // startfold
    h2 = "Let's start by getting a domain";
    h1 = "Type below to search for available domains that match your business";
    firstSmall = 'e.g. www.businessname.com';
    firstGhost = "Connect a domain you already own";
    secondSmall = "I'll add a domain later. Skip to";
    secondGhost = "Site Builder.";
    constructor(nav, regData) {
        super();
        this.searchedDomain = "";
        this.classList.add("adm-center-grid");
        this.nav = nav;
        this.regData = regData;
        this.attachHTML(`
        <h2 class="adm-header adm-breadcrumb">${this.h2}</h2>
        <h1 class="adm-header adm-descriptive-cta">${this.h1}</h1>
        <small class="adm-small">${this.firstSmall}</small>
        <form class="adm-domain-search-form" data-on-submit="searchDomain" data-tag="form">
          <input class="adm-inline-input" type="text" data-tag="domainName"></input><button class="admin-btn function-btn" type="submit">Search</button>
        </form>
        <div data-tag="message" class="adm-center-grid";>
          <small class="adm-small removable">- Or -</small>
          <button class="adm-btn adm-ghost-btn removable" data-on-click="preregistered">${this.firstGhost}</button>
        </div>
        <small class="adm-small">
            ${this.secondSmall}
            <button class="adm-btn adm-ghost-btn" data-on-click="cancel">${this.secondGhost}</button>
        </small>
        `);
        this.checkoutButton = document.createElement("button");
        this.checkoutButton.classList.add("adm-cta-btn");
        this.checkoutButton.textContent = "Proceed to Checkout!";
        this.checkoutButton.addEventListener("click", (e) => this.goCheckout(e));
    }
    goCheckout(e) {
        e.preventDefault();
        this.regData.domainName = this.searchedDomain;
        this.nav("startupDomainCheckout");
    }
    async searchDomain(e) {
        e.preventDefault();
        this.searchedDomain = this.domainName.value;
        const searchResp = await fetch(
            DOMAIN_SEARCH + `?domain-name=${this.domainName.value}`
        )
        if (!searchResp.ok) {
            MakeToast("Domain Search Failed!");
        } else {
            const resp = await searchResp.json();
            if (resp.available) {
                this.message.innerHTML = `
                  <p class="adm-text">${this.domainName.value} is available.</p>
                  <small class="adm-small">Price: $20.00/year</small>
                `;
                this.message.appendChild(this.checkoutButton);
            } else {
                this.message.innerHTML = `
                  <p class="adm-text">${this.domainName.value} is not available.</p>
                `;
            }
        }
    }
    preregistered(e) {
        e.preventDefault();
        this.nav("registrarInstructions");
    }
    cancel(e) {
        e.preventDefault();
        this.nav("generator");
    }
}
customElements.define("startup-register-domain", StartupRegisterDomain);
// endfold
export class StartupRegistrarInstructions extends CustomElement { // startfold
    h1 = "Connecting a Domain From Another Registrar";
    constructor(nav) {
        super();
        this.nav = nav;
        this.classList.add("adm-center-grid");
        this.attachHTML(`
            <h1 class="adm-header adm-breadcrumb">${this.h1}</h1>
            <hr>
            <ol>
              <li>Log in to your DNS provider</li>
              <li>Add the following TXT record:<br>
                 <div class="adm-indented">Host: @</div>
                 <div class="adm-indented">Value: ${REFERRAL_CODE}</div>
              </li>
              <li>Set your A record to:<br>
                 <div class="adm-indented">Host: @</div>
                 <div class="adm-indented">Value: ${SERVER_IP}</div>
              </li>
              <li>Enter your domain below and click "connect"</li>
            </ol>
            <form>
              <input type="text" class="adm-inline-input" data-tag="domainName"></input><button class="admin-btn function-btn" data-on-click="connect">CONNECT!</button>
            </form>
            <small class="adm-small">
                I'll add a domain later. Skip to
                <button class="admin-btn adm-ghost-btn" data-on-click="cancel">Site Builder</button>
            </small>
            <button class="admin-btn adm-deemph-btn" data-on-click="back">🡐 Back</button>
        `);
    }
    async connect(e) {
        e.preventDefault();
        const request = { domainName: this.domainName.value };
        const resp = await fetch(
            DOMAIN_CONNECT,
            {
                method: "POST",
                headers: {
                    "content-type": "application/json",
                },
                body: JSON.stringify(request),
            },
        )
        if (!resp.ok) {
            MakeToast("Domain Connection Failed!");
            const respText = await resp.text();
            console.error(respText);
        } else {
            MakeToast("Domain Connected!");
            this.nav("generator");
        }
    }
    cancel(e) {
        e.preventDefault();
        this.nav("generator");
    }
    back(e) {
        e.preventDefault();
        this.nav("registerDomain");
    }

}
customElements.define("startup-registrar-instructions", StartupRegistrarInstructions);
// endfold
export class DomainPaymentConfirmation extends CustomElement { // startfold
    constructor(nav, registrationData) {
        super();
        this.nav = nav;
        this.regData = registrationData;
        this.classList.add("adm-center-grid");
        this.attachHTML(`
            <p>This action will charge the card on file $20.00.</p>
            <p>Would you like to proceed?</p>
            <button class="admin-btn adm-deemph-btn" data-on-click="back">🡐Back</button>
            <button class="admin-btn adm-cta-btn" data-on-click="next">Confirm and Pay</button>
            <small class="adm-small">
                I'll add a domain later. Skip to
                <button class="admin-button adm-ghost-btn" data-on-click="cancel">Site Builder</button>
            </small>
        `);
    }
    cancel(e) {
        e.preventDefault();
        this.nav("close");
    }
    back(e) {
        e.preventDefault();
        this.nav("startupDomainCheckout");
    }
    async next(e) {
        const siteId = document.documentElement.dataset.siteId;
        dispatch(SetLoading);
        const regResp = await fetch(
            DOMAIN_REGISTRATION,
            {
                method: "POST",
                headers: {
                    "content-type": "application/json",
               },
                body: JSON.stringify({
                    domainName: this.regData.domainName,
                    autorenew: this.regData.autorenew,
                    siteId: siteId,
                })
            }
        );
        dispatch(UnsetLoading);
        if (!regResp.ok) {
            console.error(regResp);
            MakeToast("Domain Registration Failed!");
        } else {
            MakeToast("Assignment Complete!");
            this.nav("generator");
        }
        dispatch(UnsetLoading);
    }
    back(e) {
        e.preventDefault();
        this.nav("registerDomain");
    }
    cancel(e) {
        e.preventDefault();
        this.nav("close");
    }
}
customElements.define("domain-payment-confirmation", DomainPaymentConfirmation);
// endfold
export class StartupDomainCheckout extends CustomElement { // startfold
    constructor(nav, regData) {
        super();
        this.nav = nav;
        this.regData = regData;
        this.classList.add("adm-center-grid");
    }
    connectedCallback() {
        this.attachHTML(`
            <h1 class="adm-header adm-breadcrumb">Check Out</h1>
            <form>
              <fieldset>
                <label class="adm-text">Domain Name:</label>
                <p class="adm-text adm-cart-item">${this.regData.domainName}</p>
                <label class="adm-text">Price:</label>
                <p class="adm-text adm-cart-item">$20.00</p>
                <hr>
                <label class="adm-text autorenew-label">Auto Renew ($20/yr):</label>
                <div class="autorenew-radio-buttons">
                  <label class="adm-text" for="yes">Yes</label>
                  <input class="adm-text" type="radio" name="autorenew" value="yes" checked></input>
  
                  <label class="adm-text" for="no">No</label>
                  <input class="adm-text" type="radio" name="autorenew" value="no"></input>
                </div>
              </fieldset>
            </form>
            <button class="admin-btn adm-deemph-btn" data-on-click="back">🡐Back</button>
            <button class="admin-btn adm-cta-btn" data-on-click="next">Next</button>
            <small class="adm-small">
                I'll add a domain later. Skip to
                <button class="admin-button adm-ghost-btn" data-on-click="cancel">Site Builder</button>
            </small>
        `);
    }
    back(e) {
        e.preventDefault();
        this.nav("registerDomain");
    }
    cancel(e) {
        e.preventDefault();
        this.nav("close");
    }
    next(e) {
        const shouldRenew = this.querySelector("input[name='autorenew'][checked]").value == "yes";
        this.regData.autorenew = shouldRenew
        this.nav("paymentConfirmation");
    }
}
customElements.define("startup-domain-checkout", StartupDomainCheckout);
// endfold
//export class StartupRegisterDomain extends CustomElement { // startfold
//    constructor() {
//        super();
//    }
//}
//customElements.define("startup-register-domain", StartupRegisterDomain);
// endfold
export class GenerateSite extends CustomElement { // startfold
    h2 = "Domain Setup Complete!";
    h1 = "Tell us about your business, and we'll get a template and images set up for you to start editing!";
    caption = "More details will get you better results";

    constructor(nav, genMgr) {
        super();
        this.genMgr = genMgr;
        this.nav = nav;
        this.attachHTML(`
            <h2 class="adm-header adm-breadcrumb">${this.h2}</h2>
            <h1 class="adm-header adm-descriptive-cta">${this.h1}</h1>
            <p class="adm-text adm-caption">${this.caption}</p>
            <textarea class="adm-textarea" data-tag="prompt"></textarea>
            <button class="admin-btn adm-deemph-btn" data-on-click="cancel">Continue without AI</button>
            <button class="admin-btn adm-cta-btn" data-on-click="generate">Generate!</button>
        `);
    }
    cancel(e) {
        e.preventDefault();
        this.nav("close");
    }
    generate(e) {
        e.preventDefault();
        if (this.prompt.value == null || this.prompt.value == "") {
          MakeToast("You have to enter a prompt!");
        } else {
          this.genMgr.generate(this.prompt.value);
          this.nav("generateStarted");
        }
    }
}
customElements.define("generate-site", GenerateSite);
// endfold
export class GenerationStarted extends CustomElement { // startfold
    h2 = "Your website is being generated. This could take up to 5 minutes.";
    h1 = "While you're waiting, we've put together a quick tutorial on how to use the site!"

    constructor(nav) {
        super();
        this.nav = nav;
        this.attachHTML(`
            <h2 class="adm-header adm-breadcrumb">${this.h2}</h2>
            <h1 class="adm-header adm-descriptive-cta">${this.h1}</h1>
            <button class="admin-btn adm-cta-btn" data-on-click="next">START TUTORIAL</button>
            <button class="admin-btn adm-ghost-btn" data-on-click="cancel">I want to watch the page load instead</button>
        `);
    }
    next(e) {
      this.nav("tutorial");
    }
    cancel(e) {
      this.nav("close");
    }
}
customElements.define("generation-started", GenerationStarted);
// endfold
export class StartupTutorial extends CustomElement { // startfold
  steps = [
    {
      title: 'Everything is "Click To Change"',      
      caption: "To change any text or picture, just click on it!",
      src: "/cdn/assets/click_to_edit.gif",
    },
    {
      title: 'Start By Setting Your Colors',      
      caption: "Our photo search finds pictures that match your colors, so pick your colors first!",
      src: "/cdn/assets/edit_colors.gif",
    },
    {
      title: 'Gray Buttons Control Sections',
      caption: "When you move your mouse over a section, gray buttons will show up. These buttons let you add, remove, or change the section.",
      src: "/cdn/assets/gray_buttons.gif",
    },
    {
      title: 'Blue Buttons Control Sections',
      caption: 'Some sections, like "about," can have different numbers of elements inside them. For these sections, Blue Buttons will show up when you move your mouse over an element. These buttons help you change the element, just like the Gray Buttons help you change sections.',
      src: "/cdn/assets/blue_buttons.gif",
    },
    {
      title: 'Use The Side Panel',
      caption: 'You can find the help menu in the side panel, along with options to change fonts, your site icon, site title, and more.',
      src: "/cdn/assets/get_help.gif",
    },
  ]

  constructor(nav) {
    super();
    this.nav = nav;
    this.step = 0;
    let curStep = this.steps[this.step];
    this.attachHTML(`
        <h1 data-tag="tutorialTitle" class="adm-tutorial-title">${curStep.title}</h1>
        <h2 data-tag="tutorialCaption" class="adm-tutorial-caption">${curStep.caption}</h2>
        <img data-tag="tutorialGif" src="${curStep.src}" class="tutorial-gif">
        <button class="admin-btn adm-deemph-btn" data-on-click="prevStep">🡐Back</button>
        <button class="admin-btn adm-cta-btn" data-on-click="nextStep">Next</button>
        <button class="admin-btn adm-ghost-btn" data-on-click="cancel">I'm done learning. Let me watch the page load.</button>
    `);
  }
  nextStep() {
    this.step += 1;
    const curStep = this.steps[this.step];
    if (this.step >= this.steps.length) {
      this.nav("tutorialComplete");
    } else {
      this.tutorialTitle.textContent = curStep.title;
      this.tutorialCaption.textContent = curStep.caption;
      this.tutorialGif.src = curStep.src;
    }
  }
  prevStep(e) {
    e.preventDefault();
    if (this.step < 1) {
        return
    }
    this.step -= 1;
    const curStep = this.steps[this.step];
    this.tutorialTitle.textContent = curStep.title;
    this.tutorialCaption.textContent = curStep.caption;
    this.tutorialGif.src = curStep.src;
  }
  cancel(e) {
    e.preventDefault();
    this.nav("close");
  }
}
customElements.define("startup-tutorial", StartupTutorial);
// endfold
export class TutorialComplete extends CustomElement { // startfold
    title = "... and that's it!";
    caption = "For more advanced tutorials on how to do things like adding <span class='italic'> scheduling calendars or embeding videos</span>, check out our Youtube channel!";

    constructor(nav, genMgr) {
        super();
        this.nav = nav;
        this.genMgr = genMgr;
        this.interval = null;
    }
    connectedCallback() {
        this.attachHTML(`
          <h1 class="adm-header adm-tutorial-complete-title">${this.title}</h1>
          <h2 class="adm-tutorial-complete-caption">${this.caption}</h2>
          <button class="admin-btn adm-cta-btn" data-tag="closeButton" data-on-click="close" disabled>SEE MY NEW SITE</button>
          <p>button will turn green as soon as your site is done generating!</p>
        `);
        this.interval = setInterval(() => {
            if (this.genMgr.generationComplete) {
                this.closeButton.removeAttribute("disabled");
            } else {
                this.closeButton.setAttribute("disabled", true);
            }
        }, 1000);
    }
    disconnectedCallback() {
        if (this.interval != null) {
            clearInterval(this.interval);
        }
    }
    close(e) {
        e.preventDefault();
        this.nav("close");
    }
}
customElements.define("tutorial-complete", TutorialComplete);
// endfold
export class StartupWizard extends CustomElement { // startfold
  modal

  constructor() {
    super();
    this.domainRegistration = {};
    this.attachHTML(`

        <dialog data-tag="modal" class="adm-modal">
           <link rel="preload" href="/cdn/assets/click_to_edit.gif" as="image" type="image/gif" />
           <link rel="preload" href="/cdn/assets/edit_colors.gif" as="image" type="image/gif" />
           <link rel="preload" href="/cdn/assets/gray_buttons.gif" as="image" type="image/gif" />
           <link rel="preload" href="/cdn/assets/blue_buttons.gif" as="image" type="image/gif" />
           <link rel="preload" href="/cdn/assets/get_help.gif" as="image" type="image/gif" />
        </dialog>
    `)
    const nav = (d) => this.nav(d);
    const genMgr = new GenerationManager();

    this.pages = {
      startBuilding: new StartBuilding(nav),
      registerDomain: new StartupRegisterDomain(nav, this.domainRegistration),
      registrarInstructions: new StartupRegistrarInstructions(nav),
      startupDomainCheckout: new StartupDomainCheckout(nav, this.domainRegistration),
      paymentConfirmation: new DomainPaymentConfirmation(nav, this.domainRegistration),
      generator: new GenerateSite(nav, genMgr),
      generateStarted: new GenerationStarted(nav),
      tutorial: new StartupTutorial(nav),
      tutorialComplete: new TutorialComplete(nav, genMgr),
    }

    if (IS_LOCAL()) {
        this.nav("generator");
    } else {
        this.nav("startBuilding");
    }

    document.body.appendChild(this);
    this.modal.showModal();
  }
  nav(destination) {
    if (destination == "close") {
        this.modal.close();
        this.remove();
        dispatch(SetDocumentEditable);
        dispatch(UnsetLoading);
        return;
    }
    const page = this.pages[destination];
    if (page == null) {
        console.error(`Cannot nav to ${destination}!`);
        return
    }
    this.modal.replaceChildren(page);
  }
}
customElements.define("startup-wizard", StartupWizard);
// endfold
