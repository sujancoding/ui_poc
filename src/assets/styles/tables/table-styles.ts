export const commonTableStyles = `
pagination-controls {
    text-align: center;
    position: sticky;
    justify-content: center;
    width: 100%;
    border: solid 0.1px #ffffff;
  }
  .table {
    width: 100%;
    border-spacing: 0;
    border: 1px solid #ddd;
    background-color: white;
  }
  
  table {
    //margin-top: 0.5cm;
    border-collapse: collapse; width: 100%;
  }
  
  thead {
    position: sticky;
    top: -1px;
   z-index: 2;
  }
  
  td {
    text-align: left;
    padding: 7px 0px 7px 7px !important;
    font-family: 'Roboto';
    font-weight: 540;
    font-size: 16px;
    border-bottom: .1px solid #9c9c9c;

   
  }
  tr:hover td {
    -moz-box-shadow: 0 4px 2px -3px rgba(0, 0, 0, 0.5) inset;
    -webkit-box-shadow: 0 4px 2px -3px rgba(0, 0, 0, 0.5) inset;
    box-shadow: 0 4px 2px -3px rgba(0, 0, 0, 0.5) inset;
}
tr:hover td:first-child {
    -moz-box-shadow: 4px 4px 2px -3px rgba(0, 0, 0, 0.5) inset;
    -webkit-box-shadow: 4px 4px 2px -3px rgba(0, 0, 0, 0.5) inset;
    box-shadow: 4px 4px 2px -3px rgba(0, 0, 0, 0.5) inset;
}
tr:hover td:last-child {
    -moz-box-shadow: 0 4px 2px -3px rgba(0, 0, 0, 0.5) inset;
    -webkit-box-shadow: 0 4px 2px -3px rgba(0, 0, 0, 0.5) inset;
    box-shadow: 0 4px 2px -3px rgba(0, 0, 0, 0.5) inset;
}
  
  th {
    padding: 7px 0px 7px 7px !important ;
    color: #000000d6;
    font-weight: 600;
    opacity: 20;
    font-size: 15px;
    font-family: 'Roboto';
    background-color: #e5e5e5;
    border-bottom: .1px solid #9c9c9c;
    text-align: left;

  }

  .table-wrapper{
    margin: 12px;
    position: relative;
  }
  .loader-wrapper{
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0,0,0,0.10);
    display: flex;
    align-items: center;
    justify-content: center;
  }
  ::ng-deep.loader-wrapper circle,.loader-wrapper circle {stroke: rgb(40, 97, 194) !important;} 

  .buttonApplyFilter {
    background-color: #123969;
    color: white;
    height: 48px;
    margin-top: 47px;
    margin-left: -83px;
  }


  .form-field-size{
    font-size : 13px;
  }

  .pagination-class{
    font-size: initial;
    font-family: 'Roboto';
    display: flex;
    justify-content: end;
    font-weight: 600;
    border-top: 1px solid #d5d5d5;
}

`
export const CommonSearchFilterCard = `
.search-filter{
background-color:white; margin-left: 12px;
margin-right: 12px;border-radius: 10px;height: 131px;
}
.div-height{
  margin: 10px;
  font-size: 13px;
} 

`