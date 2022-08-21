let parsato;
async function fetchData(){ //function that fetches articles
    document.querySelector('div.loading').style.display=''
    let fetchato = await fetch(`https://api.spaceflightnewsapi.net/v3/articles?_limit=100`)
    parsato = await fetchato.json();
}

function createTable($articolo){ //Function appends and fullfills table row with an article
    let date = new Date($articolo.publishedAt)     
    let joinString = $articolo.newsSite.split(" ").join("")
    document.querySelector('body div.wrapper main  div.tabella  div.table  table').appendChild(document.createElement('tr'));
    document.querySelector('div.table table > tr:last-child').classList.add(joinString, 'shown')
    document.querySelector('div.table table > tr:last-child').setAttribute('id',`${$articolo.id}`)
    document.querySelector('div.table table > tr:last-child').innerHTML = 
    `<td> <h4>${$articolo.title}</h4> </td>
    <td> <a href="${$articolo.url}">Link</a></td>
    <td> <p>Date: ${date.getDate()}/${date.getMonth()+1}/${date.getFullYear()}</p> </td>
    <td> <img src="${$articolo.imageUrl}"></td>
    `
}

setTimeout(() => {
    document.querySelector('div.loading').style.display='none'
}, 2500);
fetchData().then(()=>{
    parsato.forEach((item)=>{
        createTable(item) //create table rows for every article fetched
    })

    let publishers = []; //array of fetched publishers to fullfill select's options names
    parsato.forEach(item => { 
        if (publishers.includes(item.newsSite)){}
        else{publishers.push(item.newsSite)}
    })

    document.querySelector('div.side > div.select').appendChild(document.createElement('select'));
    document.querySelector('div.side > div.select select').classList.add("form-select", "form-select-sm", "table-select");
    let select = document.querySelector('select.table-select');
    select.classList.add("form-select", "form-select-sm", "table-select");
    select.appendChild(document.createElement('option'))
    document.querySelector('.table-select option:last-child').setAttribute("value",'no-filter')
    document.querySelector('.table-select option:last-child').textContent= 'Filter by publisher..' //created first empty option (no-filter)

    publishers.forEach(item => { //function that creates options with publishers array's names
        select.appendChild(document.createElement('option'))
        document.querySelector('select.table-select option:last-child').setAttribute("value",`${item}`)
        document.querySelector('select.table-select option:last-child').textContent = `${item}`
    })

    document.querySelector('div.side > div.select').appendChild(document.createElement('p'));
    document.querySelector('select + p:last-child').textContent = '✕'
    
    document.querySelector("select + p").addEventListener("click",()=>{ //event that adds and removes the shown/hidden class when the reset-filter is clicked
            document.querySelector("select + p").style.display = 'none'
            select.value = "nofilter"
            document.querySelectorAll('tr').forEach(item => {item.classList.add('shown')});
            document.querySelectorAll('tr').forEach(item => {item.classList.remove('hidden')});
            })

    select.addEventListener('change',(event)=>{  //event that adds/removes shown and hidden classes when table is filtered basing on event.target.value and classnames added to each table row according to its publisher
        
        if(event.target.value==='no-filter'){
        document.querySelectorAll('tr').forEach(item => {item.classList.add('shown')});
        document.querySelectorAll('tr').forEach(item => {item.classList.remove('hidden')});
        document.querySelector("select + p").style.display = 'none'
        }
        else{
        document.querySelector("select + p").style.display = 'block'
        document.querySelectorAll('tr:not(:first-child)').forEach(item => {
            if(item.classList.contains(event.target.value.split(" ").join(''))){
                item.classList.add('shown')
                item.classList.remove('hidden')
            }
            else{
                item.classList.add('hidden')
                item.classList.remove('shown')
            }
        })
    }
    })

    //creating button for csv download
    document.querySelector('div.side').appendChild(document.createElement('button'))
    document.querySelector('div.side  button').classList.add('btn', 'btn-primary')
    document.querySelector('div.side  button').textContent = 'Download CSV'

    function download_csv(){ //function that downloads every article shown basing on its article's id
    let filtered = document.querySelectorAll(".shown");
    let ids = [];
    filtered.forEach(item => ids.push(Number(item.id)));
    let csvArray = [];
    parsato.forEach((item)=> {
        let date = new Date(item.publishedAt) 
        date.toISOString;
        if(ids.includes(Number(item.id)))
       csvArray.push([`${item.title}`, `${item.url}`, `${item.newsSite}`, `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`])
    })

    let csvFile = 'Titolo;URL;Publisher;Date;\n'
    csvArray.forEach((riga) => {
        csvFile += riga.join(";");
        csvFile += '\n'
    })

    let download = document.createElement('a');
    download.href = 'data:text/csv;charset=utf-8,' + encodeURI(csvFile);
    download.target = '_blank';
    download.download = 'Lista articoli.csv'
    download.click();
    }

    document.querySelector('div.side button.btn').addEventListener('click',()=>{
        download_csv()
    })
})