export class Dashboard {
    metrics!: Metrics[];
    exchangerate!: ExchangeRate[];
    promotions!: Promotions[];
}

export class Metrics {
    group!: string;
    subgroup!: string;
    name!: string;
    value!: string;
}

export class ExchangeRate{
  group!: string;
  subgroup!: string;
  name!: string;
  value!: string;
}

export class Promotions{
  title!: string;
  timeline!: string;
}

/** Muthu ref :- 
 * 
 * metrics:[
  {
    group:"APP",
    subgroup:"IND",
    name:"draft",
    value:"3"
  },
   {
    group:"APP",
    subgroup:"COR",
    name:"draft",
    value:"3"
  }
 * ],
  exchangerate:[
{
    group:"ERT",
    subgroup:"APT",
    name:"Malaysia",
    value:"3.10003003"
  },
{
    group:"ERT",
    subgroup:"APT",
    name:"Indonesia",
    value:"1.45959959"
  },
{
    group:"ERT",
    subgroup:"AGN",
    name:"Indonesia",
    value:"1.45959959"
  }
],
promotions:[
	title:"Bus Driver 5% cashback",
	timeline:"11 Dec 2021 - 11 Jan 2022",
]
 */