import { Component, OnInit } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { CommonModule } from '@angular/common';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { SearchComponent } from '../../search/search.component';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { SharedPathService } from '../../../services/shares/shared-path.service';
import { RegisterComponentButton } from '../../button/register/register.component';
import { LoginComponentButton } from '../../button/login/login.component';
import { AuthInterceptorService } from '../../../services/auth/auth-interceptor.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    FontAwesomeModule,
    CommonModule,
    RouterLink,
    SearchComponent,
    RegisterComponentButton,
    LoginComponentButton,
  ],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  userInfo: any;
  errorMessage: string | undefined;

   isLogin:boolean = true;
   isAdmin:boolean = false;


  listPagename = [
    {
      name: 'Quản lí',
      path: '',
    },

    {
      name: 'Dự Án',
      path: 'project',
    },
  ];
  currentPageName: string | undefined;

  constructor(
    private router: Router,
    private sharedService: SharedPathService,
    private authService: AuthInterceptorService
  ) {}

  ngOnInit() {
    this.router.events.subscribe((val: any) => {
      if (val instanceof NavigationEnd) {
        const foundPage = this.listPagename.find(
          (page) => `/${page.path}` === val.urlAfterRedirects
        );
        this.currentPageName = foundPage ? foundPage.name : '';
        this.sharedService.updateCurrentPath(this.currentPageName);
      }
    });

    this.loadUserInfo();
  }

  loadUserInfo() {
    this.authService.getUserInfo().subscribe(
      (data: any) => {
        this.userInfo = data;
        this.isLogin = true;
        this.isAdmin = data.roles.includes('admin');
       if(this.isAdmin){
         this.listPagename.push(  {
          name: 'Bảng Điều Khiển',
          path: 'control',
        },)
       }

      },
      (error: any) => {
        console.error('Failed to fetch user info', error);
        this.isLogin = false;
      }
    );
  }

  logout() {
    localStorage.removeItem('accessToken');
    this.router.navigate(['/login']);
    this.isLogin = false;
    this.userInfo = null;
    this.isAdmin = false;
  }

  faSearch = faSearch;

  logo =
    'https://www.coca-cola.com/content/dam/onexp/global/icons/Coke-company-logo-black.svg';
}
