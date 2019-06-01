import { Component } from '@angular/core';
import {
  InvoiceLine,
  InvoiceCalculatorService,
  Invoice,
  InvoiceLineComplete
} from './invoice-calculator.service';
import { VatCategory } from './vat-categories.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  invoiceLines: InvoiceLine[] = [];
  invoice: Invoice = {
    invoiceLines: [],
    totalPriceInclusiveVat: 0,
    totalPriceExclusiveVat: 0,
    totalVat: 0
  };

  product = '';
  priceInclusiveVat = 0;
  vatCategoryString = 'Food';

  vatCategories = VatCategory;

  constructor(private invoiceCalculator: InvoiceCalculatorService) {}

  checkPrice() {
    return this.priceInclusiveVat === 0;
  }

  addInvoice() {
    const newInvoice: InvoiceLine = {
      product: this.product,
      priceInclusiveVat: this.priceInclusiveVat,
      vatCategory:
        this.vatCategoryString === 'Food'
          ? VatCategory.Food
          : VatCategory.Drinks
    };
    this.invoiceLines.push(newInvoice);
    this.invoice = this.invoiceCalculator.CalculateInvoice(this.invoiceLines);
  }
}
