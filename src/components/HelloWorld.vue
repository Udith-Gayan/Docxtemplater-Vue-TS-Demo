<template>
  <div>
    <button @click="getDoc">Generate Doc</button>
    <br />
    <input type="file" @change="handleFileChange"  />
    <button @click="getPdf">Convert to pdf</button>
  </div>
</template>

<script lang="ts">
/* eslint-disable */
  import { Component, Prop, Vue } from "vue-property-decorator";
  import docxtemplater from 'docxtemplater';
  import JSZip from 'jszip';
  import JSzipUtils from 'jszip-utils';
  import  saveAs  from 'file-saver'; 
  import convertToPdf from 'docx-pdf';

  @Component(
    {
      components: {
        JSZip
      }
    }
  )
  export default class HelloWorld extends Vue {

    fileDate: any;

    handleFileChange(e: any){
      this.fileDate = e.target.files[0];
      console.log(this.fileDate);

    }

    getPdf() {
      const form = new FormData();
      form.append("Filecontent", this.fileDate);
      
      fetch("https://converter-docx-to-pdf.p.rapidapi.com/convertDOCXtoPDF", {
      	"method": "POST",
      	"headers": {
      		"content-type": "multipart/form-data; boundary=---011000010111000001101001",
      		"x-rapidapi-key": "a38c2d611bmsh044a92e5329b542p153171jsn729b4c074c87",
      		"x-rapidapi-host": "converter-docx-to-pdf.p.rapidapi.com"
        },
        body: form
      })
      .then(response => {
        const reader = response.body.getReader();
        const stream = new ReadableStream({
          start(controller) {
            // The following function handles each data chunk
            function push() {
              // "done" is a Boolean and value a "Uint8Array"
              reader.read().then(({ done, value }) => {
                
                // Is there no more data to read?
                if (done) {
                  // Tell the browser that we have finished sending data
                  controller.close();
                  return;
                }

                // Get the data and send it to the browser via the controller
                controller.enqueue(value);
                push();
              });
            };

            push();
          }
        });

        return new Response(stream, { headers: { "Content-Type": "application/pdf" } });
      })
      .then(response => response.blob())
      .then(blob => {
        // URL.createObjectURL(blob);
        console.log(blob);
        saveAs(blob, "newpdfff.pdf");
        })
      .catch(err => {
      	console.error(err);
      });
    }

    getDoc() {
      this.createDOC();
    }

    loadFile(url: any,callback: any){
        JSzipUtils.getBinaryContent(url,callback);
    }

    // loadFileFromLocal(url: any,callback: any){
    //     return new Promise((resolve,reject) => {
    //       const fr = new FileReader();
    //       let file = fr.readAsArrayBuffer('template.docx');
    //     });
    // }

    createDOC(){
        let dataset = {
          "clients": [
            {
              "first_name": "Udith",
              "last_name": "Gayan",
              "phone": "+44546546454"
            },
            {
              "first_name": "Chamal",
              "last_name": "Silva",
              "phone": "+445476454"
            }
          ],
          first_name: "John",
          last_name: "Doe",
          phone: "0652455478",
          description: "New Website"
        };

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
            // let out = doc.getZip().generate({
            //     type:"blob",
            //     mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            //     })
            // saveAs(out,`testbyudith.docx`);

// pdf generator test
            let out = doc.getZip().generate({
                type:"blob",
                mimeType: "application/pdf",
                })

             console.log(out) 
             
             let outt = new File([out], 'test.pdf')
            saveAs(outt,`testtttbyudith.pdf`);        
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
