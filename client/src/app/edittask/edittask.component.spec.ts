import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EdittaskComponent } from './edittask.component';

describe('EdittaskComponent', () => {
  let component: EdittaskComponent;
  let fixture: ComponentFixture<EdittaskComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EdittaskComponent]
    });
    fixture = TestBed.createComponent(EdittaskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
