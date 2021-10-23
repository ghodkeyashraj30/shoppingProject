import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ShopService, CartItem } from '../shop.service';
import { Product } from '../../../shared/models/product.model';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms'
import { Subscription, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { egretAnimations } from '../../../shared/animations/egret-animations';
import { AppLoaderService } from '../../../shared/services/app-loader/app-loader.service';
import * as _ from 'lodash';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss'],
  animations: [egretAnimations]
})
export class ProductsComponent implements OnInit, OnDestroy {
  public isSideNavOpen: boolean;
  public viewMode: string = 'list-view';
  public currentPage: any;
  @ViewChild(MatSidenav) private sideNav: MatSidenav;

  public products$: Observable<Product[]>;
  public categories$: Observable<any>;
  public activeCategory: string = 'all';
  public filterForm: FormGroup;
  public cart: CartItem[];
  public cartData: any;


  getDropDownText(id, object){
    const selObj = _.filter(object, function (o) {
        return (_.includes(id,o.id));
    });
    return selObj;
  }

  AssetCategoryWise: any[] = [
    'Machines', 'Laboratory Equipments', 'Computers', 'Laptops', 'Furniture & Fiextures', 'Chairs', 'Servers', ' Rocks', 'Tolls', 'Pallets'
  ]
  Material: any[] = [
    'PVC', 'ABS', 'Aluminium with Engraving', 'Aluminium with Printing', 'Stainless Steel', 'Ultra Destructive Venyl', 'Polyester', 'Metalized Polyester'
  ]
  Color: any[] = [
    {
      id:1,
      color: 'Black'
    },
    {
      id:2,
      color: 'White'
    }
  ]
  ApplyingOption: any[] = [
    {
      id: 1,
      option: 'Riveting'
    },
    {
      id:2,
      option: 'Adhesive'
    } 
  ]
  Technology: any[] = [
    'Barcode', 'QR', 'RFID'
  ]
  Surface: any[] = [
    'Metal', 'Oil Painted', 'Plastic', 'ABS'
  ]
  Environment: any[] = [
    'Open to Sky Assets', 'Server Room', 'Warehouse', 'Laboratory', 'Processing Plant','Manufacturing Plant', 'Hospitality','Office','Retail Outlet','Restraurant'
  ]
  // Size: any[] = [
  //   '40*15', '40*25', '50*25', '50*35', '60*40', '75*40' ,'75*50', '100*50', '100*60'
  // ]
  mySelect = '';
  selectedValue: any;

  data = [
    {
      id: 1,
      size: '40*15',
    },
    {
      id: 2,
      size: '40*25',

    },
    {
      id: 3,
      size: '50*25',
    },
    {
      id: 4,
      size: '50*35',

    },
    {
      id: 5,
      size: '60*40',

    },
    {
      id: 6,
      size: '75*40',

    },
    {
      id: 7,
      size: '75*50',

    },
    {
      id: 8,
      size: '100*50',

    },
    {
      id: 9,
      size: '100*60',

    },
  ];

  constructor(
    private shopService: ShopService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private loader: AppLoaderService
  ) { }



  ngOnInit() {
    this.categories$ = this.shopService.getCategories();
    this.buildFilterForm(this.shopService.initialFilters);
    
    setTimeout(() => {
      this.loader.open();
    });
    this.products$ = this.shopService
      .getFilteredProduct(this.filterForm)
      .pipe(
        map(products => {
          this.loader.close();
          return products;
        })
      );
    this.getCart();
    this.cartData = this.shopService.cartData;
  }
  ngOnDestroy() {

  }
  getCart() {
    this.shopService
    .getCart()
    .subscribe(cart => {
      this.cart = cart;
    })
  }
  addToCart(product) {
    let cartItem: CartItem = {
      product: product,
      data: {
        quantity: 1
      }
    };
    this.shopService
    .addToCart(cartItem)
    .subscribe(cart => {
      this.cart = cart;
      this.snackBar.open('Product added to cart', 'OK', { duration: 4000 });
    })
  }

  buildFilterForm(filterData:any = {}) {
    this.filterForm = this.fb.group({
      search: [''],
      category: ['all'],
      minPrice: [filterData.minPrice],
      maxPrice: [filterData.maxPrice],
      minRating: [filterData.minRating],
      maxRating: [filterData.maxRating]
    })
  }
  setActiveCategory(category) {
    this.activeCategory = category;
    this.filterForm.controls['category'].setValue(category)
  }

  toggleSideNav() {
    this.sideNav.opened = !this.sideNav.opened;
  }
  selectChange() {
    this.selectedValue = this.getDropDownText(this.mySelect, this.data)[0].name;
}
}
