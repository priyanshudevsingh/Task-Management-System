import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MytasksComponent } from './mytasks.component';

describe('MytasksComponent', () => {
  let component: MytasksComponent;
  let fixture: ComponentFixture<MytasksComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MytasksComponent]
    });
    fixture = TestBed.createComponent(MytasksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
