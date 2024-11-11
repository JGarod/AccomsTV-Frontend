import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthStreamComponent } from './auth-stream.component';

describe('AuthStreamComponent', () => {
  let component: AuthStreamComponent;
  let fixture: ComponentFixture<AuthStreamComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuthStreamComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AuthStreamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
