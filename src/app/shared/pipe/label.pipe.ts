import {
    Pipe,
    PipeTransform
} from '@angular/core';
import data from '../../../assets/label.json';

@Pipe({
    name: 'label'
})

export class LabelPipe implements PipeTransform {
    label: any = data;
    transform(key: string): string {
        if (key != null && key != undefined && key != "")
            return this.label[key];
        return key;
    }
} 