import {Component, OnInit} from '@angular/core';
import DatoCmsPlugin from 'datocms-plugins-sdk';

interface IOption {
    key: string;
    value: string;
    selected: boolean;
}

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

    public fieldName: string;
    public options: IOption[] = [];
    public currentSelection: string[] = [];
    public plugin: any;

    constructor() {
    }

    ngOnInit(): void {
        DatoCmsPlugin.init((plg) => {
            this.plugin = plg;
            this.plugin.startAutoResizer();

            this.fieldName = this.plugin.field.attributes.label;

            this.currentSelection = JSON.parse(this.plugin.getFieldValue(this.plugin.fieldPath)) || [];

            const parameters = JSON.parse(this.plugin.parameters.instance.options);
            parameters.forEach((option) => {
                this.options.push({
                    key: option.key,
                    value: option.value,
                    selected: this.currentSelection.indexOf(option.key) >= 0
                });
            });
        });
    }

    public onCheckChange(option: IOption) {
        option.selected = !option.selected;
        if (option.selected) {
            this.currentSelection.push(option.key);
        } else {
            this.currentSelection.splice(this.currentSelection.indexOf(option.key), 1);
        }
        this.plugin.setFieldValue(this.plugin.fieldPath, JSON.stringify(this.currentSelection));
    }

}
