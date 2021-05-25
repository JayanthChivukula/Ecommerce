import { Component, OnInit } from '@angular/core';
import { OrderHistory } from 'src/app/common/order-history';
import { OrderHistoryService } from 'src/app/services/order-history.service';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-order-history',
  templateUrl: './order-history.component.html',
  styleUrls: ['./order-history.component.css'],
})
export class OrderHistoryComponent implements OnInit {
  storage: Storage = sessionStorage;
  orderHistoryList: OrderHistory[] = [];

  constructor(private orderHistoryService: OrderHistoryService) {}

  handleOrderHistory() {
    const theEmail: string = this.storage.getItem('userEmail');

    this.orderHistoryService.getOrderHistory(theEmail).subscribe((data) => {
      this.orderHistoryList = data._embedded.orders;
    });
  }
  ngOnInit(): void {
    this.handleOrderHistory();
  }

  //implementation of pdf generation
  generatePDF(action = 'open') {
    let docDefinition = {
      content: [
        {
          text: 'MY SHOP PRIVATE LIMITED',
          fontSize: 25,
          alignment: 'center',
          color: 'green',
        },
        {
          text: 'INVOICE',
          fontSize: 20,
          alignment: 'center',
          color: 'maroon',
          decoration: 'underline',
        },
        {
          text: 'Order Details',
          style: 'sectionHeader',
        },
        {
          table: {
            headerRows: 1,
            widths: ['*', 'auto', 'auto', 'auto'],
            body: [
              [
                'OrderTrakingNumber',
                'TotalPrice',
                'TotalQuantity',
                'DateCreated',
              ],

              ...this.orderHistoryList.map((order) => [
                order.orderTrackingNumber,
                order.totalPrice,
                order.totalQuantity,
                order.dateCreated,
              ]),
            ],
          },
        },
        {
          columns: [
            [
              {
                //QR Code
                qr: `${this.storage.getItem('userEmail')}`,
                fit: '50',
              },
            ],
            [
              {
                text: 'Signature',
                alignment: 'right',
                italics: true,
              },
            ],
          ],
        },
        {
          text: 'Terms & Conditions',
          style: 'sectionHeader',
        },
        {
          ul: [
            'Order can be returned in max 10 days',
            'Warrenty of the product will be subject to the manufacturer terms and conditions',
            'This is sytem generated invoice, does not require signature',
          ],
        },
      ],
      styles: {
        sectionHeader: {
          bold: true,
          decoration: 'underline',
          fontSize: 16,
          margin: [0, 10, 0, 10],
        },
      },
    };

    if (action === 'download') {
      pdfMake.createPdf(docDefinition).download();
    } else if (action === 'print') {
      pdfMake.createPdf(docDefinition).print();
    } else {
      pdfMake.createPdf(docDefinition).open();
    }
  }
}
