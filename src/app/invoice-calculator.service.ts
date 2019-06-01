import { Injectable } from '@angular/core';
import { VatCategory, VatCategoriesService } from './vat-categories.service';

export interface InvoiceLine {
  product: string;
  vatCategory: VatCategory;
  priceInclusiveVat: number;
}

export interface InvoiceLineComplete extends InvoiceLine {
  priceExclusiveVat: number;
}

export interface Invoice {
  invoiceLines: InvoiceLineComplete[];
  totalPriceInclusiveVat: number;
  totalPriceExclusiveVat: number;
  totalVat: number;
}

@Injectable({
  providedIn: 'root'
})
export class InvoiceCalculatorService {
  constructor(private vatCategoriesService: VatCategoriesService) {}

  public CalculatePriceExclusiveVat(
    priceInclusiveVat: number,
    vatPercentage: number
  ): number {
    const solution = priceInclusiveVat / (1 + (vatPercentage / 100)) * 100;
    return Math.round(solution) / 100;
  }

  public CalculateInvoice(invoiceLines: InvoiceLine[]): Invoice {
    const invoice: Invoice = {
      invoiceLines: [],
      totalPriceInclusiveVat: 0,
      totalPriceExclusiveVat: 0,
      totalVat: 0
    };

    invoiceLines.forEach(element => {
      const priceExVat = this.CalculatePriceExclusiveVat(
        element.priceInclusiveVat,
        this.vatCategoriesService.getVat(element.vatCategory)
      );

      const completeLine: InvoiceLineComplete = {
        product: element.product,
        vatCategory: element.vatCategory,
        priceInclusiveVat: element.priceInclusiveVat,
        priceExclusiveVat: priceExVat
      };

      invoice.totalPriceExclusiveVat += completeLine.priceExclusiveVat;
      invoice.totalPriceInclusiveVat += completeLine.priceInclusiveVat;

      invoice.invoiceLines.push(completeLine);
    });

    invoice.totalVat =
      invoice.totalPriceInclusiveVat - invoice.totalPriceExclusiveVat;

    return invoice;
  }
}
