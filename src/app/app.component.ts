import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, DefaultIterableDiffer, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';
import { User, UserColumns } from './model/user';
import { UserService } from './services/user.service';
import { MatTable } from '@angular/material/table';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {MatSnackBar} from '@angular/material/snack-bar';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})

export class AppComponent {
  @ViewChild('dataTable') table: MatTable<User>;
  displayedColumns: string[] = UserColumns.map((col) => col.key);
  columnsSchema: any = UserColumns;
  // dataSource = new MatTableDataSource<User>();
  dataSource: any = new MatTableDataSource<User>();
  valid: any = {};
  TEST_DATA = [
    {
      id: 1,
      displayName: 'HP Support',
      link: 'https://support.hp.com',
      description: `Hydrogen is a chemical element with symbol H and atomic number 1. With a standard
        atomic link of 1.008, hydrogen is the lightest element on the periodic table.`
    },
    {
      id: 2,
      displayName: 'HP Forum',
      link: 'https://forum.hp.com',
      description: `Hydrogen is a chemical element with symbol H and atomic number 1. With a standard
        atomic link of 1.008, hydrogen is the lightest element on the periodic table.`
    },
    {
      id: 3,
      "displayName": "HP Troubleshooting Guide",
      "link": "https://www.verifyemailaddress.org/#result",
      description: `Hydrogen is a chemical element with symbol H and atomic number 1. With a standard
        atomic link of 1.008, hydrogen is the lightest element on the periodic table.`
    },
    {
      id: 4,
      "displayName": "HP Troubleshooting Guide",
      "link": "https://www.verifyemailaddress.org/#result",
      description: `Hydrogen is a chemical element with symbol H and atomic number 1. With a standard
        atomic link of 1.008, hydrogen is the lightest element on the periodic table.`
    }
  ];
  
  ELEMENT_DATA: PeriodicElement[] = [
    {
      ID: 1,
      DisplayName: 'HP Support',
      Link: 'https://forum.hp.com',
    }, {
      ID: 2,
      DisplayName: 'HP Troubleshooting',
      Link: 'https://forum.hp.com',
    }, {
      ID: 3,
      DisplayName: 'HP customer',
      Link: 'https://forum.hp.com',
    }, {
      ID: 4,
      DisplayName: 'HP Home',
      Link: 'https://forum.hp.com',
    }, {
      ID: 5,
      DisplayName: 'HP India',
      Link: 'https://forum.hp.com',
    }, {
      ID: 6,
      DisplayName: 'HP regional',
      Link: 'https://forum.hp.com',
    }
  ];
  dataSource1 = this.ELEMENT_DATA;
  columnsToDisplay = ['DisplayName', 'Link', ];
  expandedElement: PeriodicElement | null;

  constructor(public dialog: MatDialog, private userService: UserService,
    private _snackBar: MatSnackBar) {
    
   }

  ngOnInit() {
    this.userService.getUsers().subscribe((res: any) => {
      this.dataSource.data = this.TEST_DATA;
      // this.dataSource.data = res;
    });
  }

  dropTable(event: CdkDragDrop<User[]>): void {
    moveItemInArray(this.dataSource.filteredData, event.previousIndex, event.currentIndex);
    this.table.renderRows();
  }

  editRow(row: User) {
    if (row.id === 0) {
      this.userService.addUser(row).subscribe((newUser: User) => {
        row.id = newUser.id;
        row.isEdit = false;
      });
    } else {
      this.userService.updateUser(row).subscribe(() => (row.isEdit = false));
    }
  }

  addRow() {
    const newRow: User = {
      id: 0,
      displayName: '',
      link: '',
      status: '',
      isEdit: true,
      isSelected: false,
    };
    this.dataSource.data = [newRow, ...this.dataSource.data];
  }

  removeRow(id: number) {
    const users = this.dataSource.data.filter((u: User) => u.isSelected);
    this.dialog
      .open(ConfirmDialogComponent)
      .afterClosed()
      .subscribe((confirm) => {
        if (confirm) {
          this.userService.deleteUser(id).subscribe(() => {
            this.dataSource.data = this.dataSource.data.filter(
              (u: User) => u.id !== id
            );
          });
        }
      });
   
  }

  removeSelectedRows() {
    const users = this.dataSource.data.filter((u: User) => u.isSelected);
    this.dialog
      .open(ConfirmDialogComponent)
      .afterClosed()
      .subscribe((confirm) => {
        if (confirm) {
          this.userService.deleteUsers(users).subscribe(() => {
            this.dataSource.data = this.dataSource.data.filter(
              (u: User) => !u.isSelected
            );
          });
        }
      });
  }

  inputHandler(e: any, id: number, key: string) {
    if (!this.valid[id]) {
      this.valid[id] = {};
    }
    this.valid[id][key] = e.target.validity.valid;
  }

  disableSubmit(id: number) {
    if (this.valid[id]) {
      return Object.values(this.valid[id]).some((item) => item === false);
    }
    return false;
  }
  openSnackBar() {
    this.userService.openSnackBar('Data saved successfully', 'Done')
  }
}
export interface PeriodicElement {
  DisplayName: string;
  ID: number;
  Link: string;
}
