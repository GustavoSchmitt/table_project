
import * as json from './data.json' with { type: 'json' }
import fs from 'node:fs';

const data = json.default

// const jsonFile = fs.readFile('/data.json', (err, data) => {
//     if (err) throw err;
//     console.log(data);
//   });

function createTable(data) {
    const table = document.createElement('table');
    table.id = 'myTable';

    const thead = document.createElement('thead');
    const tbody = document.createElement('tbody');

    const headers = ['ID', 'Nome', 'Idade', 'Remove'];
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

        Object.values(item).forEach((text,i) => {
            const cell = row.insertCell();
            cell.textContent = text;

            if (i) {
                cell.addEventListener('dblclick', () => {
                    cell.setAttribute('contenteditable', true);

                    document.addEventListener('click', (element) => {
                        if (element.target !== cell) {
                            cell.removeAttribute('contenteditable')
                        }
                    })
                }, cell)
            }

            cell.addEventListener('input', () => {
                const rowIndex = row.rowIndex - 1;
                const cellIndex = cell.cellIndex;
                const key = Object.keys(data[rowIndex])[cellIndex];
                data[rowIndex][key] = cell.textContent;
            });
        });

        const removeButton = document.createElement('button')
        removeButton.textContent = 'X'
        const remove = row.insertCell()

        removeButton.addEventListener('click', () => {
            const index = data.findIndex(a => a.id === item.id)
            data.splice(index, 1)
            loadTable(data)
        })

        remove.append(
            removeButton
        )
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
const table = createTable(data)
const submit = document.createElement('button')
const newRow = document.createElement('button')
submit.textContent = 'Save table'
newRow.textContent = 'Nova linha'

submit.addEventListener('click', () => {
    console.log(JSON.stringify(data))
    
    })

newRow.addEventListener('click', () => {
    data.push({
        id: data.length + 1,
        nome: 'Unnamed',
        idade: 0,
    })
    loadTable(data);

})

document.getElementById('table-container').append(
    table,
    newRow,
    submit
);
loadTable(data);