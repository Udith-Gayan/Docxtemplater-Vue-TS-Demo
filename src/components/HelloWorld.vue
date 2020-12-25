<template>
  <div>
    <button @click="getDoc">Download Word Document</button>
    <br />
    <input type="file" id="fileinput" @change="selectFile" accept="application/vnd.openxmlformats-officedocument.wordprocessingml.document" />
    <button @click="convertthedocToPdf">Convert and download</button>

  </div>
</template>
<script src="https://apis.google.com/js/api.js"></script>
<script lang="ts">
/* eslint-disable */
  import { Component, Prop, Vue } from "vue-property-decorator";
  import docxtemplater from 'docxtemplater';
  import JSZip from 'jszip';
  import JSzipUtils from 'jszip-utils';
  import  saveAs  from 'file-saver';
  import  {ConvertApi} from 'convertapi-js';
  import convertToPdf from 'docx-pdf';
  // import * as apis from 'apis';
  // import '@/convertapi-js-master/src/convertapi'

  // import VueGoogleApi from 'vue-google-api';

  @Component(
    {
      components: {
        JSZip
      }
    }
  )
  export default class HelloWorld extends Vue {

    config = {
                      apiKey: 'AIzaSyBl__HXmM-BGhbLWr5XrO7TkMeNA2whrT8',
                      clientId: '758058407223-hvomncjkfm1up5eoa0s7fd2sb9bdc5hr.apps.googleusercontent.com',
                      scope: 'https://www.googleapis.com/auth/drive https://www.googleapis.com/auth/drive.appdata https://www.googleapis.com/auth/drive.file',
                      discoveryDocs: [ 'https://www.googleapis.com/discovery/v1/apis/drive/v3/rest' ]
    }
    
   GoogleAuth: any;

   convertApi : any;
   selectedFile: any;

  created() {
    }

  mounted() {
    this.convertApi =  ConvertApi.auth({secret: 'LKKvvknbz7Tftz8p', apiKey: '112058292', token: ''});
    
  }

  //  mount(){
  //    window.gapi.load('client:auth2', this.initClient);
  //  }

  //  initClient() {
  //    window.gapi.client.init(this.config).then((value:any) => {
  //      console.log("Authenticated");
  //    });
  //  }


  selectFile(event: any){
    console.log('File selected');
    console.log(event.target.files[0])
    this.selectedFile = event.target.files[0];
  }

  async convertthedocToPdf(){
    if(this.selectedFile){
      // let params = this.convertApi.createParams()
      // params.add('file', this.selectedFile);
      // let result = await this.convertApi.convert('docx', 'pdf', params);
      // let url = result.files[0].Url;
      // console.log(url);
      const filePath = URL.createObjectURL(this.selectedFile);
      console.log(filePath);
      // D:\Apex\Other related tasks and documents\RD on docxtemplater\Demo Vue Project\docstemplater-demo\public\doctemplates
      let ss = convertToPdf('./doctemplates/template.docx', './testpdf.pdf', (err:any, res:any) => {
        console.log(err);
        console.log(res);
      })
    } else {
      alert(" No file selected");
    }
  }


 /*  Below code is related to the generation of docx from the given template */
    getDoc() {
      this.createDOC();
    }

    loadFile(url: any,callback: any){
        JSzipUtils.getBinaryContent(url,callback);
    }

    createDOC(){
      /*
      *   This required JSON dataset must be fetched from the backend API.
      *   The tags in the template will be replaced by these data.
      *   For demonstrations, I have hardcoded the tesdt dataset
      */
        let dataset = {
          "clients": [
            {
              "first_name": "Udith",
              "last_name": "Indrakantha",
              "phone": "+44546546454"
            },
            {
              "first_name": "Chamal",
              "last_name": "Silva",
              "phone": "+445476454"
            }
          ],
          creater_name: "Udith Gayan Indrakantha",
          tested_date: "22/12/2020",
          phone: "0652455478",
          header: "Apex Website Docx Creation Testing"
        };

        /* *
        * The template's path must be passed as an arguement .
        * This path can be either a URL(as  in the commented line) or a path relative to the Public folder
        * For testing, I have created a folder named  "doctemplates" inside the public folder and it contains my sample
        * template named "template.docx" .
        * */
        // this.loadFile("https://docxtemplater.com/tag-example.docx",function(error: any,content : any){
          this.loadFile('doctemplates/template.docx',function(error: any,content : any){
            if (error) { 
              throw error
               };

            console.log(content);
            let zip = new JSZip(content);
            let doc = new docxtemplater().loadZip(zip)
            doc.setData(dataset)

            try {
                doc.render()
            }

            catch (error) {
                let e = {
                    message: error.message,
                    name: error.name,
                    stack: error.stack,
                    properties: error.properties,
                }
                console.log(JSON.stringify({error: e}));
                // The error thrown here contains additional information when logged with JSON.stringify (it contains a property object).
                throw error;
            }

// docx generator
            let out = doc.getZip().generate({
                type:"blob",
                mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",

                })
            saveAs(out,`FinaleDoc.docx`);    // You can pass this blob to a custom file saver component in the project.  
        });

    }

  }
</script>


<style scoped lang="scss">
  h3 {
    margin: 40px 0 0;
  }
  ul {
    list-style-type: none;
    padding: 0;
  }
  li {
    display: inline-block;
    margin: 0 10px;
  }
  a {
    color: #42b983;
  }
</style>
