import { modalBuilder } from "./base.js";
import { SetDocumentEditable, UnsetDocumentEditable, SetLoading, UnsetLoading, dispatch } from "../interfaces/events.js";

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

function runAIGeneration() {
        const promptContent = document.getElementById("user-ai-description");
        if (promptContent == null) {
            dispatch(SetDocumentEditable);        
            return;
        }
        dispatch(SetLoading);
        dispatch(UnsetDocumentEditable);
        fetch("/sandbox/ai", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ "prompt": promptContent.value })
        })
        .then(response => response.json())
        .then(data => {
            console.log(data.prompt);
            window.loadSectionsFromJSON(data.sections);
            window.loadMetadataFromJSON(data.metadata);
            dispatch(SetDocumentEditable);
            dispatch(UnsetLoading);
        })
        .catch(error => console.error("Error:", error));
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
      .setHeaderText("Welcome To Two Dollar Website")
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
