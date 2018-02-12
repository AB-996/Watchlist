
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'length'
})

export class MaxLengthPipe implements PipeTransform {

    transform(value: string): string {
        if(value.length > 23){
            return value.slice(0,23) + "..."
        }else{
            return value;
        }
    }
}