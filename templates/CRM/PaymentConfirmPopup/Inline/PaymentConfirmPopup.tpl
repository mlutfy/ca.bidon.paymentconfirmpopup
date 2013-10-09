{* *********************************************************
 * Confirmation popup for contrib forms without review page.
 * $ppType determines whether it is the main call, or ajax for payment block.
 * ********************************************************* *}
{if ! $ppType}
<div id="crm-contribute-paymentconfirmpopup">
  <div class="crm-paymentconfirmpopup-description">{ts}Please review your information below.{/ts}</div>
  <div class="crm-paymentconfirmpopup-items-wrapper">
    <div class="crm-section" id="crm-paymentconfirmpopup-section-amount"></div>
    <div class="crm-section">
      <div class="label">{ts}Name{/ts}</div>
      <div class="content" id="crm-paymentconfirmpopup-name"></div>
    </div>
    <div class="crm-section">
      <div class="label">{ts}E-mail address{/ts}</div>
      <div class="content" id="crm-paymentconfirmpopup-email"></div>
    </div>
  </div>
</div>
{/if}
