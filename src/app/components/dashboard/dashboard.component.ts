import { Component, OnInit } from '@angular/core';
import {MenuItem, MessageService} from 'primeng/api';
import { Product } from '../../api/product';
import { ProductService } from '../../service/productservice';
import { Subscription } from 'rxjs';
import { ConfigService } from '../../service/app.config.service';
import { AppConfig } from '../../api/appconfig';
import {DatePipe} from "@angular/common";
import * as xlsx from 'xlsx';
import {Users} from "../../model/users";
import {ExcelService} from "../../service/excel.service";

@Component({
    templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit {

    ImportDialog: boolean;

    ImportDialog2: boolean;

    contenutab: any[];


    CC:any;

    participant: string;

    conjoint: string;

    enfant: string;

    products: Product[];

    product: Product;

    Users: Users[];

    impor: Users[];

    importe: Users[];

    utilisateurs: Users;

    selectedProducts: Users[];

    baro: number;

    pret: boolean;

    submitted: boolean;

    ModifDialog: boolean;

    cols: any[];

    rowsPerPageOptions = [10, 20, 30];

    selectedItem: any;

    items: any[];

    com:string;

    nombre : number;

    nombreb : number;


    datet: Date;

    ws: any[];
    wb: xlsx.WorkBook;
    charger:boolean;
    charger2:boolean;
    //fichierChoisi : Fichier = new Fichier();
    nomFichier: string;



    today: Date = new Date();
    pipe = new DatePipe('en-US');

    chartData: any;

    chartOptions: any;


    subscription: Subscription;

    config: AppConfig;
    esssai: string;
    ta: any;
    tab: any;
    tab1: any;
    tabex = [];
    json= {Matricule : null, Prenom: null, Nom : null, Sexe: null, Naissance: null, Statut: null, Telephone: null, Email: null, CIN:null};
    essai:Date;
    todayWithPipe = null;
    stateOptions: any[];
    paymentOptions: any[];
    constructor(private productService: ProductService, public configService: ConfigService, public excelService: ExcelService, private messageService: MessageService) {}

    ngOnInit() {
        this.pret=true;
        this.essai= new Date("02/09/2009");
        console.log(this.essai)
        this.stateOptions = [{label: 'M', value: 'M'}, {label: 'F', value: 'F'}];
        this.paymentOptions = [{name: 'P', value: 'P'}, {name: 'C', value: 'C'}, {name: 'E ', value: 'E'}];
        this.subscription = this.configService.configUpdate$.subscribe(config => {
            this.config = config;
        });
        this.chartData = {
            labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
            datasets: [
                {
                    label: 'First Dataset',
                    data: [65, 59, 80, 81, 56, 55, 40],
                    fill: false,
                    backgroundColor: '#2f4860',
                    borderColor: '#2f4860',
                    tension: .4
                },
                {
                    label: 'Second Dataset',
                    data: [28, 48, 40, 19, 86, 27, 90],
                    fill: false,
                    backgroundColor: '#00bb7e',
                    borderColor: '#00bb7e',
                    tension: .4
                }
            ]
        };
    }
    openNew(){
        this.ImportDialog2=true;
    }
    openNew2(utilisateurs: Users) {
        this.utilisateurs = {...utilisateurs};
        this.datet = new Date(this.utilisateurs.Naissance);
        this.ModifDialog=true;
    }
    Importer(){
        this.ImportDialog=true;
        this.impor=this.Users;
    }
    hideDialog() {
        this.charger=false;
        this.charger2=false;
        this.ImportDialog = false;
        this.ImportDialog2 = false;
    }
    Modifier(){
        this.submitted = true;
        if (this.utilisateurs.matricule.trim() && this.utilisateurs.prenom.trim() && this.utilisateurs.nom.trim() && this.utilisateurs.sexe.trim() && this.utilisateurs.Naissance.trim() && this.utilisateurs.statut.trim()) {
            if (this.utilisateurs.id) {
                this.impor[this.utilisateurs.id-1] = this.utilisateurs;
                this.messageService.add({severity: 'success', summary: 'Successful', detail: 'Modification Effectuée', life: 3000});
            } else {
                /*
                this.product.id = this.createId();
                this.product.code = this.createId();
                this.product.image = 'product-placeholder.svg';
                // @ts-ignore
                this.product.inventoryStatus = this.product.inventoryStatus ? this.product.inventoryStatus.value : 'INSTOCK';
                this.products.push(this.product);
                this.messageService.add({severity: 'success', summary: 'Successful', detail: 'Product Created', life: 3000});*/
            }

            this.impor = [...this.impor];
            this.ModifDialog = false;
            this.utilisateurs = {};
            this.submitted = false;
        }
    }
    onUpload(event) {
        this.pret=false;
        this.Users=[];
        const target: DataTransfer = <DataTransfer>(event.target);
        this.nomFichier = target.files[0].name;
        this.nomFichier=this.nomFichier.replace(".xlsx", "")
        this.charger=true;
        this.charger2=true;
        if (target.files.length !== 1) throw new Error('Cannot use multiple files');
        const reader: FileReader = new FileReader();
        reader.onload = (e: any) => {
            /* read workbook */
            let bstr = e.target.result;
            this.wb = xlsx.read(bstr, {type: 'binary'});
            /* grab first sheet */
            this.baro=0;
            this.wb.SheetNames.forEach(ele => {
                this.ws = xlsx.utils.sheet_to_json(this.wb.Sheets[ele], {
                    raw: false,
                    dateNF: "yyyy-mm-dd"
                })
                if(this.wb.Sheets[ele]["H2"]){
                    this.ta=this.wb.Sheets[ele]["H2"].v.split(" ")
                    if(this.ta[0]=="Matricule:"){
                        this.Users[this.baro]={};
                        this.Users[this.baro].id=this.baro+1
                        if (this.wb.Sheets[ele]["H2"]!=undefined){
                            this.Users[this.baro].matricule=this.wb.Sheets[ele]["H2"].v.substring(12);
                        }
                        if (this.wb.Sheets[ele]["C6"]!=undefined){
                            this.Users[this.baro].prenom=this.wb.Sheets[ele]["C6"].v;
                        }
                        if (this.wb.Sheets[ele]["I6"]!=undefined){
                            this.Users[this.baro].nom=this.wb.Sheets[ele]["I6"].v;
                        }
                        if (this.wb.Sheets[ele]["D8"]!=undefined){
                            this.essai= new Date(this.wb.Sheets[ele]["D8"].w);
                            this.todayWithPipe = this.pipe.transform(this.essai, 'yyyy/MM/dd');
                            this.Users[this.baro].Naissance=this.todayWithPipe;
                        }
                        if (this.wb.Sheets[ele]["I10"]!=undefined){
                            this.Users[this.baro].telephone=this.wb.Sheets[ele]["I10"].v;
                        }
                        this.participant="P";
                        this.conjoint="C";
                        this.enfant="E";
                        this.nombre=18;
                        this.nombreb=27;
                        this.Users[this.baro].statut=this.participant;
                        if (this.wb.Sheets[ele]["A18"]!=undefined){
                            while (this.wb.Sheets[ele]["A"+this.nombre]!=undefined){
                                this.baro++;
                                this.Users[this.baro]={};
                                this.Users[this.baro].id=this.baro+1;
                                this.Users[this.baro].matricule=this.wb.Sheets[ele]["H2"].v.substring(12);
                                this.tab=this.wb.Sheets[ele]["A"+this.nombre].v.split(" ")
                                this.Users[this.baro].nom=this.tab[this.tab.length-1]
                                this.Users[this.baro].prenom=this.wb.Sheets[ele]["A"+this.nombre].v.replace(this.Users[this.baro].nom, "");
                                this.essai= new Date(this.wb.Sheets[ele]["D"+this.nombre].w);
                                this.tab=this.wb.Sheets[ele]["A"+this.nombre].v.split("/")

                                console.log(this.wb.Sheets[ele]["D"+this.nombre].w)
                                console.log(this.essai)
                                this.Users[this.baro].Naissance=this.wb.Sheets[ele]["D"+this.nombre].w;
                                this.Users[this.baro].statut=this.conjoint;
                                this.nombre++;
                            }
                        }
                        if (this.wb.Sheets[ele]["A27"]!=undefined){
                            this.tab1=this.wb.Sheets[ele]["A27"].v.split(" ")
                            while (this.wb.Sheets[ele]["A"+this.nombreb]!=undefined){
                                this.baro++;
                                this.Users[this.baro]={};
                                this.Users[this.baro].id=this.baro+1;
                                this.Users[this.baro].matricule=this.wb.Sheets[ele]["H2"].v.substring(12);
                                if(this.tab1.length>1){
                                    this.Users[this.baro].nom=this.tab1[this.tab1.length-1];
                                    this.Users[this.baro].prenom=this.wb.Sheets[ele]["A"+this.nombreb].v.replace(this.Users[this.baro].nom, "");
                                }
                                else{
                                    this.Users[this.baro].prenom=this.wb.Sheets[ele]["A"+this.nombreb].v;
                                }
                                this.Users[this.baro].sexe=this.wb.Sheets[ele]["D"+this.nombreb].v;
                                if (this.wb.Sheets[ele]["E"+this.nombreb]!=undefined){
                                   // console.log(this.wb.Sheets[ele]["E"+this.nombreb].w)
                                    this.Users[this.baro].Naissance=this.wb.Sheets[ele]["E"+this.nombreb].w;
                                }
                                this.Users[this.baro].statut=this.enfant;
                                this.nombreb++;
                            }
                        }
                        this.baro++;
                    }
                    else{
                    }
                }
            });
            this.pret=true;
        };
        this.importe=this.Users
        reader.readAsBinaryString(target.files[0]);
    }
    exportAsXLSX():void {
        for (let i = 0; i < this.importe.length; i++) {
            this.json.Matricule = this.importe[i].matricule,
                this.json.Prenom = this.importe[i].prenom,
                this.json.Nom = this.importe[i].nom,
                this.json.Sexe = this.importe[i].sexe,
                this.json.Naissance = this.importe[i].Naissance,
                this.json.Statut = this.importe[i].statut,
                this.json.Telephone = this.importe[i].telephone,
                this.json.Email= this.importe[i].email,
                this.json.CIN = this.importe[i].CIN,
                this.tabex.push({...this.json});
        }
        this.excelService.exportAsExcelFile(this.tabex, this.nomFichier);
        this.hideDialog();
    }

}
