export interface SuccessResponse<T> {  
    meta: {  
      message: string;  
      statusCode: number;  
    };  
    data: T | null; // Data bisa null jika tidak ada data yang dikembalikan  
}  

export const createResponse = <T>(message: string, data: T, statusCode:number): SuccessResponse<T> => {  
    return {  
        meta: {  
          message,  
          statusCode,  
        },  
        data: data
    };  
};  
    
