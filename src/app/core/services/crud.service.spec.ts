import { TestBed } from '@angular/core/testing';
import { CrudService } from './crud.service';
import {HttpClientTestingModule, HttpTestingController} from "@angular/common/http/testing";

describe('CrudService', () => {
  let service: CrudService;
  let httpMock: HttpTestingController;
  const apiUrl = '/bp/products';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
       providers: [CrudService]
    });
    service = TestBed.inject(CrudService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  // describe('readData', () => {
  //   it('should return data from GET request', (done) => {
  //     const dummyData = { data: 'some data' };
  //
  //     service.readData().then(data => {
  //       expect(data).toEqual(dummyData);
  //       done();
  //     });
  //
  //     const req = httpMock.expectOne(apiUrl);
  //     expect(req.request.method).toBe('GET');
  //     req.flush(dummyData);
  //   });
  // });

  describe('postData', () => {
    it('should send data via POST request', () => {
      const postData = { name: 'Test' };
      const dummyResponse = { id: 1, ...postData };

      service.postData(postData).subscribe(response => {
        expect(response).toEqual(dummyResponse);
      });

      const req = httpMock.expectOne(apiUrl);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(postData);
      req.flush(dummyResponse);
    });
  });

  describe('getById', () => {
    it('should return data from GET request with endpoint', (done) => {
      const id = '123';
      const endpoint = '/verification';
      const dummyData = { data: 'some data' };

      service.getById(id, endpoint).then(data => {
        expect(data).toEqual(dummyData);
        done();
      });

      const req = httpMock.expectOne(`${apiUrl}${endpoint}/${id}`);
      expect(req.request.method).toBe('GET');
      req.flush({ data: dummyData });
    });
  });

  describe('getByIdEdit', () => {
    it('should return data from GET request with ID', (done) => {
      const id = '123';
      const dummyData = { data: 'some data' };

      service.getByIdEdit(id).then(data => {
        expect(data).toEqual(dummyData);
        done();
      });

      const req = httpMock.expectOne(`${apiUrl}/${id}`);
      expect(req.request.method).toBe('GET');
      req.flush({ data: dummyData });
    });
  });


  describe('put', () => {
    it('should send data via PUT request', (done) => {
      const id = '123';
      const putData = { name: 'Updated Test' };
      const dummyResponse = { id, ...putData };

      service.put(putData, id).then(response => {
        expect(response).toEqual(dummyResponse);
        done();
      });

      const req = httpMock.expectOne(`${apiUrl}/${id}`);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(putData);
      req.flush({ data: dummyResponse });
    });
  });

  describe('delete', () => {
    it('should send a DELETE request', () => {
      const id = '123';
      const dummyResponse = { success: true };

      service.delete(id).subscribe(response => {
        expect(response).toEqual(dummyResponse);
      });

      const req = httpMock.expectOne(`${apiUrl}/${id}`);
      expect(req.request.method).toBe('DELETE');
      req.flush(dummyResponse);
    });
  });
});
