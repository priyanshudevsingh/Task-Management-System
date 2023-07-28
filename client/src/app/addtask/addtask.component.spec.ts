import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddtaskComponent } from './addtask.component';

describe('AddtaskComponent', () => {
  let component: AddtaskComponent;
  let fixture: ComponentFixture<AddtaskComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddtaskComponent]
    });
    fixture = TestBed.createComponent(AddtaskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
