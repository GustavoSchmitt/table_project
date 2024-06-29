
import * as json from './data.json' with { type: 'json' }

const data = json.default


function createTable(data) {
    const table = document.createElement('table');
    table.id = 'myTable';

    const thead = document.createElement('thead');
    const tbody = document.createElement('tbody');

    const headers = ['ID', 'Nome', 'Idade'];
    const headerRow = document.createElement('tr');

    headers.forEach((header, index) => {
        const th = document.createElement('th');
        th.textContent = header;
        th.dataset.type = typeof Object.values(data[0])[index];
        th.addEventListener('click', () => {
            const ordered = !!th.ordered
            document.querySelectorAll('#myTable th').forEach(th => th.ordered = undefined);
            th.ordered = !ordered
            sortTable(index, th.dataset.type, th.ordered);
        });
        headerRow.appendChild(th);
    });

    thead.appendChild(headerRow);
    table.appendChild(thead);
    table.appendChild(tbody);

    return table
}

function loadTable(data) {
    const table = document.getElementById('myTable').getElementsByTagName('tbody')[0];

    table.replaceChildren()
    
    data.forEach(item => {
        const row = table.insertRow();

        Object.values(item).forEach(text => {
            const cell = row.insertCell();
            cell.textContent = text;

            cell.addEventListener('dblclick',()=>{
                cell.setAttribute('contenteditable', true);
                
                document.addEventListener('click',(element)=>{
                    if(element.target !== cell){
                        cell.removeAttribute('contenteditable')}
                })
            },cell)

            cell.addEventListener('input', () => {
                const rowIndex = row.rowIndex - 1;
                const cellIndex = cell.cellIndex;
                const key = Object.keys(data[rowIndex])[cellIndex];
                data[rowIndex][key] = cell.textContent;
            });
        });
    });
}

function sortTable(columnIndex, type, ordered) {
    const ordem = ordered ? 'crescente' : 'decrescente'
    const sortedData = [...data].sort((a, b) => {
        let valA = Object.values(a)[columnIndex];
        let valB = Object.values(b)[columnIndex];

        if (type === 'number') {
            valA = parseFloat(valA);
            valB = parseFloat(valB);
            return valA - valB;
        } else {
            return valA.localeCompare(valB);
        }
    });
    if (ordem === "decrescente") {
        loadTable(sortedData.reverse());
    } else {
        loadTable(sortedData);
    }
}

document.getElementById('table-container').appendChild(
    createTable(data)
);
loadTable(data);