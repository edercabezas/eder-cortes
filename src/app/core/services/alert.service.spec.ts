import { TestBed } from '@angular/core/testing';
import { AlertService } from './alert.service';
import {ToastrService} from "ngx-toastr";


class MockToastrService {
  success(message: string) { }
  error(message: string) { }
  warning(message: string) { }
}


describe('AlertService', () => {
  let service: AlertService;
  let mockToastrService: MockToastrService;

  beforeEach(() => {

    mockToastrService = new MockToastrService();

    TestBed.configureTestingModule({
      providers: [
        AlertService,
        { provide: ToastrService, useValue: mockToastrService }
      ]
    });
    service = TestBed.inject(AlertService);
  });


  it('showToasterFull', () => {
    spyOn(mockToastrService, 'success');
    const message = 'Test success message';

    service.showToasterFull(message);

    expect(mockToastrService.success).toHaveBeenCalledWith(message);
  });

  it('showToasterError', () => {
    spyOn(mockToastrService, 'error');
    const message = 'Test error message';

    service.showToasterError(message);

    expect(mockToastrService.error).toHaveBeenCalledWith(message);
  });

  it('showToasterUpdate', () => {
    spyOn(mockToastrService, 'success');
    const message = 'Test update message';

    service.showToasterUpdate(message);

    expect(mockToastrService.success).toHaveBeenCalledWith(message);
  });

  it('showToasterWarning', () => {
    spyOn(mockToastrService, 'warning');
    const message = 'Test warning message';

    service.showToasterWarning(message);

    expect(mockToastrService.warning).toHaveBeenCalledWith(message);
  });

});
