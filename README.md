Payment Confirmation Popup
==========================

On Contribution public forms, display a popup confirmation before submitting
the form. This usually goes well with disabling the CiviCRM confirmation page.

Written and maintained by (C) Mathieu Lutfy (Coop SymbioTIC), 2010-2015  
https://www.symbiotic.coop/

To get the latest version of this module:
https://github.com/mlutfy/ca.bidon.paymentconfirmpopup

Distributed under the terms of the GNU Affero General public license (AGPL).
See LICENSE.txt for details.

Features
========

On a contribution page, if you disable the "confirmation page", this
extension will instead display a confirmation popup with the name, e-mail
address and amount that were entered in the form. This way you can at
least be sure that the most critical details have been confirmed.

Use-cases supported:

* A contribution page with pre-defined amounts (aka the most common use-case).
* A contribution page with the "other amount" field.
* A contribution page with recurring payment options.
* All of the above, combined with a membership option.

Complex price sets have not been exhaustively tested. If your use case is not
there, whether it worked or not, please send a screenshot and let me know!

NB: for iPhone, iPad and iPod, the popup is not enabled, since there are known
issues with the Credit Card saving feature of Safari. So for these devices,
clicking on the "submit" button of the main form will immediately submit,
without any confirmation.

TODO
====

It can be rather awkward if your form has rather obvious errors and if they
are not validated before the form is submitted (ex: empty fields). As of
CiviCRM 4.4, the Main.tpl template has commented out jquery to validate the
form before submission. We should probably have a better way of plugging into
that, and also having some support for site-specific validation.

Requirements
============

- CiviCRM >= 4.4 (4.6 recommended)

Installation
============

1- Download this extension and unpack it in your 'extensions' directory.
   You may need to create it if it does not already exist, and configure
   the correct path in CiviCRM -> Administer -> System -> Directories.

2- Enable the extension from CiviCRM -> Administer -> System -> Extensions.

Support
=======

Please post bug reports in the issue tracker of this project on github:
https://github.com/mlutfy/ca.bidon.paymentconfirmpopup/issues

For general support questions, please post on the CiviCRM Extensions forum:
https://forum.civicrm.org/index.php/board,57.0.html

This is a community contributed extension written thanks to the financial
support of the organisations using it, as well as the very helpful and
collaborative CiviCRM community.

If you appreciate this module, please consider donating 10$ to the CiviCRM project:
https://civicrm.org/participate/support-civicrm

While I do my best to provide volunteer support for this extension, please
consider financially contributing for support or development of this extension:
https://www.symbiotic.coop/

