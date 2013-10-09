<?php

require_once 'paymentconfirmpopup.civix.php';

/**
 * Implementation of hook_civicrm_config
 */
function paymentconfirmpopup_civicrm_config(&$config) {
  _paymentconfirmpopup_civix_civicrm_config($config);
}

/**
 * Implementation of hook_civicrm_xmlMenu
 *
 * @param $files array(string)
 */
function paymentconfirmpopup_civicrm_xmlMenu(&$files) {
  _paymentconfirmpopup_civix_civicrm_xmlMenu($files);
}

/**
 * Implementation of hook_civicrm_install
 */
function paymentconfirmpopup_civicrm_install() {
  return _paymentconfirmpopup_civix_civicrm_install();
}

/**
 * Implementation of hook_civicrm_uninstall
 */
function paymentconfirmpopup_civicrm_uninstall() {
  return _paymentconfirmpopup_civix_civicrm_uninstall();
}

/**
 * Implementation of hook_civicrm_enable
 */
function paymentconfirmpopup_civicrm_enable() {
  return _paymentconfirmpopup_civix_civicrm_enable();
}

/**
 * Implementation of hook_civicrm_disable
 */
function paymentconfirmpopup_civicrm_disable() {
  return _paymentconfirmpopup_civix_civicrm_disable();
}

/**
 * Implementation of hook_civicrm_upgrade
 *
 * @param $op string, the type of operation being performed; 'check' or 'enqueue'
 * @param $queue CRM_Queue_Queue, (for 'enqueue') the modifiable list of pending up upgrade tasks
 *
 * @return mixed  based on op. for 'check', returns array(boolean) (TRUE if upgrades are pending)
 *                for 'enqueue', returns void
 */
function paymentconfirmpopup_civicrm_upgrade($op, CRM_Queue_Queue $queue = NULL) {
  return _paymentconfirmpopup_civix_civicrm_upgrade($op, $queue);
}

/**
 * Implementation of hook_civicrm_managed
 *
 * Generate a list of entities to create/deactivate/delete when this module
 * is installed, disabled, uninstalled.
 */
function paymentconfirmpopup_civicrm_managed(&$entities) {
  return _paymentconfirmpopup_civix_civicrm_managed($entities);
}

/**
 * Implementation of hook_civicrm_buildForm().
 */
function paymentconfirmpopup_civicrm_buildForm($formName, &$form) {
  // Separate each form in its own callback.
  $f = 'paymentconfirmpopup_civicrm_buildForm_' . $formName;
  if (function_exists($f)) {
    $f($form);
  }
}

/**
 * @see paymentconfirmpopup_civicrm_buildForm().
 */
function paymentconfirmpopup_civicrm_buildForm_CRM_Contribute_Form_Contribution_Main(&$form) {
  $dao = new CRM_Contribute_DAO_ContributionPage();
  $dao->id = 1;

  if (! $dao->find(TRUE)) {
    // This should never happen
    CRM_Core_Error::fatal("Could not find the ID of the contribution page. Seems like an un-handled use-case. Please submit a bug report with a full backtrace.");
  }

  // Add the placeholder for the confirmation popup
  CRM_Core_Region::instance('page-footer')->add(array(
    'template' => 'CRM/PaymentConfirmPopup/Inline/PaymentConfirmPopup.tpl',
    'weight' => 1,
  ));

  CRM_Core_Resources::singleton()->addStyleFile('ca.bidon.paymentconfirmpopup', 'paymentconfirmpopup.css');

  dsm($dao, 'dao');
  dsm($form);
}

/**
 * @see paymentconfirmpopup_civicrm_buildForm().
 */
function paymentconfirmpopup_civicrm_buildForm_CRM_Contribute_Form_ContributionPage_Settings(&$form) {
  // Trying to future proof weird use-cases of CiviCRM versions
  if (! $form->elementExists('is_confirm_enabled')) {
    CRM_Core_Session::setStatus(ts('Could not find the confirmation page checkbox option. This version of CiviCRM may not be compatible with this version of the Payment Confirm Popup extension or you have discovered an unsupported use case. Please provide feedback on the <a href="%1">CiviCRM Extensions forum</a>.', array(1 => 'http://forum.civicrm.org/index.php/board,57.0.html')), ts('Payment Confirm Popup extension compatibility issue'), 'alert');
  }

  // Alter the "enable form confirmation" setting to mention that this extension
  // will enable itself automatically if you disable confirmations.
  $e = $form->getElement('is_confirm_enabled');
  $e->setLabel(ts('Use a confirmation page? (if not, a confirmation popup will be displayed, using the <a href="%1" target="_blank">Payment Confirm Popup extension</a>.)', array(1 => 'https://github.com/mlutfy/ca.bidon.paymentconfirmpopup')));
}

