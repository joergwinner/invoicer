/// <reference path="../types.ts"/>

var invoiceController = angular.module('invoice.controller', []);


class InvoiceController implements invoice.IController {
  static $inject = [
    '$scope'
  ];

  invoice = {
    'number': 'ABC001',
    'companyInfo': {
      'name': 'We Are Wizards Ltd',
      'companyNumber': 'Company No.: 08861162',
      'website': 'www.vincent.is',
      'address1': 'Bristol & West House, Post Office Road',
      'address2': 'Bournemouth, Dorset, UK, BH1 1BL',
      'email': 'prouillet.vincent@gmail.com',
      'vatRegistrationNumber': 'VAT: 23-23-23',
      'logo': 'http://placehold.it/200x200'
    },
    'clientInfo': {
      'name': 'Client Inc',
      'address1': '10 Downing Street',
      'address2': 'SW1A 2AA, London, UK'
    },
    'currency': '£',
    'tax': 20,
    'date': '2014/04/01',
    'dueDate': '2014/04/15',
    'items': [
      {'description': 'Something invoiceable', 'price': 75, quantity:3}
    ],
    'paymentTerms': 'Money transfer to the account below.\nWe Are Wizards Ltd\n\
Account number: 12345678\nSort code: 12-34-56'
   };

  showLogo = true;

  constructor(private $scope: core.IScope) {
    $scope.vm = this;

    this._loadFromLocalStorage('companyInfo');
    this._loadFromLocalStorage('paymentTerms');

    this.$scope.$watch('vm.invoice.companyInfo', () => {
      this._saveInLocalStorage('companyInfo');
    }, true);

     this.$scope.$watch('vm.invoice.paymentTerms', () => {
      this._saveInLocalStorage('paymentTerms');
    });
  }

  _loadFromLocalStorage(key: string) {
    if (localStorage[key] !== undefined) {
      this.invoice[key] = JSON.parse(localStorage[key]);
    }
  }

  _saveInLocalStorage(key: string) {
    localStorage[key] = JSON.stringify(this.invoice[key])
  }

  calculateSubtotal() {
    var subtotal = 0;
    this.invoice.items.forEach(function(item) {
      subtotal += item.quantity * item.price;
    });
    return subtotal;
  }

  calculateTaxes() {
    return (this.calculateSubtotal() * this.invoice.tax) /100;
  }

  removeItem(item: invoice.IItem) {
    this.invoice.items.splice(this.invoice.items.indexOf(item), 1);
  }

  addItem() {
    this.invoice.items.push(
      {'description': 'New row', 'price': 0, 'quantity': 0}
    )
  }

  toggleShowLogo() {
    this.showLogo = !this.showLogo;
  }

  changeLogo(element: any) {
    var reader = new FileReader();
    reader.onload = (e) => {
      var logoTag = <HTMLImageElement> document.getElementById('logo');
      logoTag.src = e.target.result;
      this.invoice.companyInfo.logo = logoTag.src;
      this.$scope.$apply();
    };
    reader.readAsDataURL(element.files[0]);
  }

  clearLocalStorage() {
    localStorage.removeItem('paymentTerms');
    localStorage.removeItem('companyInfo');
    // youhou refresh
    location.reload();
  }

}

invoiceController.controller('InvoiceController', InvoiceController);
