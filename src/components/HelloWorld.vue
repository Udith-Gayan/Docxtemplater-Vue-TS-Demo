<template>
  <div>
    <button @click="getDoc">Download Word Document</button>

  </div>
</template>

<script lang="ts">
/* eslint-disable */
  import { Component, Prop, Vue } from "vue-property-decorator";
  import docxtemplater from 'docxtemplater';
  import JSZip from 'jszip';
  import JSzipUtils from 'jszip-utils';
  import  saveAs  from 'file-saver';

  @Component(
    {
      components: {
        JSZip
      }
    }
  )
  export default class HelloWorld extends Vue {

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
