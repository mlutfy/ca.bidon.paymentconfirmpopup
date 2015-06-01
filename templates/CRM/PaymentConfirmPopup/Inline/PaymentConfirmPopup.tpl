{* *********************************************************
 * Confirmation popup for contrib forms without review page.
 * $ppType determines whether it is the main call, or ajax for payment block.
 * ********************************************************* *}
{* if ! $ppType *}
<div id="crm-paymentconfirmpopup">
  <p class="crm-paymentconfirmpopup-description">{ts domain='ca.bidon.paymentconfirmpopup'}Please review your information below.{/ts}</p>
  <div class="crm-paymentconfirmpopup-items-wrapper">
    <div class="crm-section" id="crm-paymentconfirmpopup-section-amount"></div>
    <div class="crm-section" id="crm-paymentconfirmpopup-section-recurrent"></div>
    <div class="crm-section">
      <div class="label">{ts domain='ca.bidon.paymentconfirmpopup'}Name{/ts}</div>
      <div class="content" id="crm-paymentconfirmpopup-name"></div>
    </div>
    <div class="crm-section">
      <div class="label">{ts domain='ca.bidon.paymentconfirmpopup'}E-mail address{/ts}</div>
      <div class="content" id="crm-paymentconfirmpopup-email"></div>
    </div>
  </div>
</div>
{* /if *}
