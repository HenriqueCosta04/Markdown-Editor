export const convertTableHtmlToMarkdown = (html: string): string => {
    if (!html || html.trim() === '') {
        return html;
    }

    const tableMatch = html.match(/<table[^>]*>([\s\S]*?)<\/table>/i);
    if (!tableMatch) {
        return html; // Return original HTML if no table found
    }

    const tableContent = tableMatch[1];
    
    const theadMatch = tableContent.match(/<thead[^>]*>([\s\S]*?)<\/thead>/i);
    const tbodyMatch = tableContent.match(/<tbody[^>]*>([\s\S]*?)<\/tbody>/i);
    
    const rowsSource = theadMatch || tbodyMatch ? 
        (theadMatch?.[1] || '') + (tbodyMatch?.[1] || '') : 
        tableContent;
    
    const rowMatches = rowsSource.match(/<tr[^>]*>([\s\S]*?)<\/tr>/gi);
    if (!rowMatches || rowMatches.length === 0) {
        return html
    }

    const rows: string[][] = [];
    let headerRowIndex = -1;

    rowMatches.forEach((rowHtml, index) => {
        const cells: string[] = [];
        
        const hasHeaders = /<th[^>]*>/i.test(rowHtml);
        if (hasHeaders && headerRowIndex === -1) {
            headerRowIndex = index;
        }
        
        const cellMatches = rowHtml.match(/<t[hd][^>]*>([\s\S]*?)<\/t[hd]>/gi);
        if (cellMatches) {
            cellMatches.forEach(cellHtml => {
                let cellContent = cellHtml
                    .replace(/<t[hd][^>]*>/i, '')
                    .replace(/<\/t[hd]>/i, '')
                    .replace(/<p[^>]*>/gi, '')
                    .replace(/<\/p>/gi, '')
                    .replace(/\s+/g, ' ')
                    .trim();
                
                cellContent = cellContent.replace(/\|/g, '\\|');
                
                cells.push(cellContent || ' ');
            });
        }
        
        if (cells.length > 0) {
            rows.push(cells);
        }
    });

    if (rows.length === 0) {
        return html; // Return original HTML if no rows found
    }

    let markdown = '';
    
    rows.forEach((row, index) => {
        markdown += '| ' + row.join(' | ') + ' |\n';
        
        if (index === headerRowIndex) {
            const separator = row.map(() => '---').join(' | ');
            markdown += '| ' + separator + ' |\n';
        }
    });

    return markdown;
};