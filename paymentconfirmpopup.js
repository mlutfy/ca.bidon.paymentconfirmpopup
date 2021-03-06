
cj(function($) {
  // Disable on iOS, because there are weird bugs in Safari causing
  // the connection to be interrupted after clicking the final 'submit' in the popup.
  var iOS = /(iPad|iPhone|iPod)/g.test(navigator.userAgent);

  if (iOS) {
    return;
  }

  // Remove the default 'onclick' event on the submit button (since 4.4, has submitOnce JS on it)
  cj('#crm-container .crm-contribution-main-form-block #crm-submit-buttons input').attr('onclick', '').unbind('click');

  // As of CiviCRM 4.4, this is the most common case: jquery-validate is not enabled by default.
  // If it is, you will need to explicitely bind the params.submitHandler
  // c.f. templates/CRM/Form/validate.tpl
  if (CRM.validate.functions.length > 0) {
    cj('#crm-container .crm-contribution-main-form-block #crm-submit-buttons input.form-submit').click(function(e) {
      e.preventDefault();
      paymentconfirmpopup_show_popup();
    });
  }
});

  // Helper functions
  function paymentconfirmpopup_set_name() {
    var name = '';

    if (cj('#billing_individual_prefix option:selected').size() > 0) {
      name += cj('#billing_individual_prefix option:selected').html() + ' ';
    }

    if (cj('#billing_first_name').size() > 0) {
      name += cj('#billing_first_name').val() + ' ';
    }
    else if (cj('#first_name').size() > 0) {
      name += cj('#first_name').val() + ' ';
    }

    if (cj('#billing_first_name').size() > 0) {
      name += cj('#billing_last_name').val();
    }
    else if (cj('#last_name').size() > 0) {
      name += cj('#last_name').val();
    }

    cj('#crm-paymentconfirmpopup-name').html(name);
  }

  function paymentconfirmpopup_set_recurrentinfo() {
    // The is_recur is normally a checkbox, but it can be hidden if it was forced in a buildForm() hack.
    // Ex: for contrib pages that are only for monthly contributions.
    if (cj('#is_recur').size() <= 0 || ! (cj('#is_recur').is(':checked') || cj('input#is_recur[type="hidden"]').val() == 1)) {
      return;
    }

    var recurnode = cj('#is_recur').parent().parent().clone();

    recurnode.find('*').each(function(key, val) {
      var id = cj(this).attr('id');

      if (id) {
        cj(this).attr('id', id + '-clone');
      }
    });

    var html = recurnode.html();
    cj('#crm-paymentconfirmpopup-section-recurrent').html(html);

    // copy the original input values, since clone does not
    // copy the value unless it was part of the original html.
    cj('#is_recur').parent().find('*').each(function(key, val) {
      if (! (cj(this).attr('type') == 'text' || cj(this).is('select'))) {
        return;
      }

      var id = cj(this).attr('id');

      if (id) {
        var v = cj(this).val();
        cj('#' + id + '-clone').val(v);
        cj('#' + id + '-clone').prop('disabled', true);
      }
    });

    // Set the size of the text inputs to the width of their value
    cj('#crm-paymentconfirmpopup-section-recurrent > input.form-text').each(function(key, val) {
      var size = cj(this).val();
      size = '' + size;
      size = size.length;
      cj(this).attr('size', size);
    });

    // Replace the select with its text value
    if (cj('#crm-paymentconfirmpopup-section-recurrent select#frequency_unit-clone').size() > 0) {
      var textvalue = cj('#crm-paymentconfirmpopup-section-recurrent select#frequency_unit-clone option:selected').html();
      cj('#crm-paymentconfirmpopup-section-recurrent select#frequency_unit-clone').replaceWith('<span>' + textvalue + '</span>');
    }

    // Hide the checkbox clone
    cj('#is_recur-clone').hide();
  }

  function paymentconfirmpopup_show_popup(form) {
    var pricehtml = '';
    var otheramountlabel = '';

    // There may be many contrib amounts (ex: membership + donation)
    // or just plain "Other Amount" contrib, in which case, we will want
    // to skip inserting a "newline" (<br>).
    var br = true;

    // Log google-analytics, if available
    if (typeof _gaq != 'undefined') {
      _gaq.push(['_trackEvent', 'CiviCRMPaymentConfirm', 'PopupOpen']);
    }

    // Reset the popup content, just in case
    cj('#crm-paymentconfirmpopup-section-amount').html('');

    // Get the contribution amount
    cj('#crm-container #priceset input:checked').each(function(key, val) {
      var priceid = cj(this).attr('id');

      // Label amount might be: $50 or "1 year membership - $5"
      var selectedamountlabel = cj('label[for=' + priceid + ']').html();

      // NB: kept in parent namespace because it is re-used later (to rename in the popup).
      otheramountlabel = ts('Other Amount', {domain: 'ca.bidon.paymentconfirmpopup'});

      if (selectedamountlabel == otheramountlabel) {
        selectedamountlabel = '';
        br = false;
      }
      else {
        // We still fetch the field label, if it's a donation, makes things more clear
        // Ex: Membership: 1 year membership - $5
        // Ex: Other amount: $50
        // Ex: Amount: $50
        var lineitemlabel = cj('#' + priceid).closest('.crm-section').find('.label label').clone();

        // hides the "field is mandatory" label
        lineitemlabel.find('span').hide();
        var html = lineitemlabel.html();

        // Add divs to display properly
        html = '<div class="label">' + html + '</div>';
        html += '<div class="content">' + selectedamountlabel + '</div>';

        pricehtml += html;
      }
    });

    // Show "other amount" (and possibly others, not tested on more complex pricesets)
    cj('#crm-container #priceset .other_amount-section input').filter(function() {
      return parseInt(cj(this).val(), 10) > 0;
    })
    .each(function() {
      if (pricehtml) {
        if (br) {
          pricehtml += '<br/>';
        }
        else {
          br = true;
        }
      }

      // Replace the "Other Amount" label to "Amount" (which may be translated or overriden)
      var re = new RegExp(otheramountlabel);
      var labelamount = ts('Amount', {domain: 'ca.bidon.paymentconfirmpopup'});
      var label = cj(this).closest('.crm-section').find('.label label').html();

      label = label.replace(re, labelamount);
      var x = cj(this).val();

      // get pre_help & post_help (usually the currency)
      var prehelp = '';
      var posthelp = '';

      if (cj(this).closest('.content').find('.description-pre').length) {
        prehelp = cj(this).closest('.content').find('.description-pre').html();
      }

      if (cj(this).closest('.content').find('.description').length) {
        posthelp = cj(this).closest('.content').find('.description').html();
      }

      x = prehelp + x + posthelp;

      label = '<div class="label">' + label + '</div>';
      x = '<div class="content">' + x + '</div>';

      pricehtml += label + x;
    });

    cj('#crm-paymentconfirmpopup-section-amount').html(pricehtml);

    // Test for recurrent payments
    paymentconfirmpopup_set_recurrentinfo();

    // Show the e-mail of the donor (to make sure we send the receipt to the right person)
    var email = cj('#email-5').val();
    cj('#crm-paymentconfirmpopup-email').html(email);

    // Show full name, ex: Mr. John Doe
    paymentconfirmpopup_set_name();

    // Ready to popup
    // NB: "class" is reserved word in IE8, must be quoted.
    cj('#crm-paymentconfirmpopup').dialog({
      title: ts('Payment Confirmation', {domain: 'ca.bidon.paymentconfirmpopup'}),
      resizable: false,
      width: (cj('body').width() < 600 ? cj('body').width() + 'px' : '600px'),
      modal: true,
      buttons: {
        'cancel': {
          text: ts('Cancel', {domain: 'ca.bidon.paymentconfirmpopup'}),
          "class": 'crm-paymentconfirmpopup-cancel',
          click: function() {
            if (typeof _gaq != 'undefined') {
              _gaq.push(['_trackEvent', 'CiviCRMPaymentConfirm', 'Cancel']);
            }

            cj(this).dialog('close');
          }
        },
        'continue': {
          text: ts('Continue', {domain: 'ca.bidon.paymentconfirmpopup'}),
          "class": 'crm-paymentconfirmpopup-continue',
          click: function() {
            cj('.crm-paymentconfirmpopup-cancel').hide();
            cj('.crm-paymentconfirmpopup-continue').attr('disabled', 'disabled');
            cj('.crm-paymentconfirmpopup-continue .ui-button-text').html(ts('Processing...', {domain: 'ca.bidon.paymentconfirmpopup'}));

            // On iOS (ipad/iphone) Safari wants to prompt the user on whether to save
            // the CC number of not. The prompt is annoying, and breaks the submit of the
            // popup (causes a "page cannot be displayed").
            // c.f. http://stackoverflow.com/questions/20210093/stop-safari-on-ios7-prompting-to-save-card-data
            try {
              cj('#credit_card_number').prop('type', 'hidden');
            }
            catch (e) {
              // ignore.
            }

            // FIXME: this does not work, because the page reloads, so the event is usually interrupted.
            if (typeof _gaq != 'undefined') {
              _gaq.push(['_trackEvent', 'CiviCRMPaymentConfirm', 'Continue']);
            }

            // Attempt to avoid weird double-POST bug
            if(! this.wasSent) {
              this.wasSent = true;
            }
            else {
              return;
            }

            // The "form" element will have been passed by jquery-validate, if it is enabled
            // http://jqueryvalidation.org/validate/
            // and we cannot call the 'submit()' function again if we're using jquery-validate,
            // because it will try to validate again.
            if (typeof form == 'undefined') {
              // contrib form is not using jquery-validate
              cj('#Main').submit();
            }
            else {
              // contrib form is using jquery-validate
              form.submit();
            }
          }
        }
      },
      open: function() {
        // Focus on the "continue" button by default, otherwise it's the first button (cancel).
        cj('.crm-paymentconfirmpopup-continue').focus();
      }
    });

    return true;
  }

