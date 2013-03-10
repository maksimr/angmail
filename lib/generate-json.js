(function(global, undefined) {
    "use strict";

    Array.isArray = Array.isArray || function(e) {
        return "[object Array]" === Object.prototype.toString.call(e);
    };

    Object.prototype.isEmpty = function() {
        for (var e in this)
        if (this.hasOwnProperty(e)) return !1;
        return !0;
    };

    var JsonGenerator = {
        inited: false,
        init: function(e) {
            this.inited = true;
            return this.config = e || {}, this.parseFieldRegex = /\{\{?(\w+)(?:\((-?\d*(?:\.?)\d+?)?((\w*[\-:\.\s]?)*)?.?\s*?(-?\d*(?:\.?)\d+?)?\))?\}\}/g, this.makeData(), this;
        },
        makeData: function() {
            var e = this.generate.cfg.data;
            for (var t in e)
            e.hasOwnProperty(t) && (e[t] = e[t].split(","));
        },
        makeRandoms: function() {
            var e = {}, t = this.generate.cfg.data;
            for (var n in t)
            t.hasOwnProperty(n) && (e[n] = this.generate.numeric(0, t[n].length - 1));
            this.generate.cfg.random = e;
        },
        generateObjects: function(e, t) {
            for (var n = [], r = 1; t >= r; r++)
            n.push(this.parseObject(e, r));
            return n;
        },
        cloneObject: function(e) {
            if (!e || "object" != typeof e) return e;
            var t, n, r = "function" == typeof e.pop ? [] : {};
            for (t in e)
            e.hasOwnProperty(t) && (n = e[t], r[t] = n && "object" == typeof n ? this.cloneObject(n) : n);
            return r;
        },
        parseObject: function(e, t) {
            e = this.cloneObject(e), this.makeRandoms();
            for (var n in e)
            e.hasOwnProperty(n) && (e[n] = this.parseFieldValues(e[n], t));
            return e;
        },
        parseArray: function(e) {
            if (this.stringHasTags(e[0])) {
                var t = this.parseStringParams(e.shift()).filter(function(e) {
                    return e;
                }),
                    n = e[0],
                    r = parseInt(t[2], 10),
                    i = parseInt(t[3], 10),
                    o = r;
                if (isNaN(i) || (o = this.generate.numeric(r, i)), !n || 0 === n.length || n.isEmpty()) return [];
                if ("object" == typeof n) e = this.generateObjects(n, o);
                else {
                    e = [];
                    for (var a = 0; o > a; a++)
                    e.push(this.parseFieldValues(n, a))
                }
            }
            return e
        },
        stringHasTags: function(e) {
            return e ? -1 !== e.indexOf("{{") : !1
        },
        parseFieldValues: function(e, t) {
            return Array.isArray(e) ? e = this.parseArray(e) : "object" == typeof e ? e = this.parseObject(e, 0) : "string" == typeof e ? e = this.parseString(e, t) : "function" == typeof e && (e = e.call(this.generate, t)), e
        },
        parseStringParams: function(e) {
            var t = null;
            return this.stringHasTags(e) && (t = (this.parseFieldRegex.exec(e) || []).filter(function() {
                return !0
            }), this.parseFieldRegex.lastIndex = 0), t
        },
        parseString: function(e, t) {
            var n = this;
            if (n.stringHasTags(e)) {
                var r = "";
                e = e.replace(n.parseFieldRegex, function() {
                    var e = Array.prototype.slice.call(arguments).filter(function(e) {
                        return e
                    });
                    return r = e[1], n.generate[r](e[2], e[3], t)
                }), "bool" === r ? e = "true" === e : "date" !== r && !isNaN(parseFloat(e)) && isFinite(e) && (e = +e);
            }
            return e;
        },
        generate: {
            cfg: {
                data: {
                    firstNames: "Isabella,Emma,Olivia,Sophia,Ava,Emily,Madison,Abigail,Chloe,Mia,Elizabeth,Addison,Alexis,Ella,Samantha,Natalie,Grace,Lily,Alyssa,Ashley,Sarah,Taylor,Hannah,Brianna,Hailey,Kaylee,Lillian,Leah,Anna,Allison,Victoria,Avery,Gabriella,Nevaeh,Kayla,Sofia,Brooklyn,Riley,Evelyn,Savannah,Aubrey,Alexa,Peyton,Makayla,Layla,Lauren,Zoe,Sydney,Audrey,Julia,Jasmine,Arianna,Claire,Brooke,Amelia,Morgan,Destiny,Bella,Madelyn,Katherine,Kylie,Maya,Aaliyah,Madeline,Sophie,Kimberly,Kaitlyn,Charlotte,Alexandra,Jocelyn,Maria,Valeria,Andrea,Trinity,Zoey,Gianna,Mackenzie,Jessica,Camila,Faith,Autumn,Ariana,Genesis,Payton,Bailey,Angelina,Caroline,Mariah,Katelyn,Rachel,Vanessa,Molly,Melanie,Serenity,Khloe,Gabrielle,Paige,Mya,Eva,Isabelle",
                    lastNames: "Abramson,Hoggarth,Adamson,Brickman,Mercer,Brooks,Michaelson,Brown,Miers,Bush,Miller,Calhoun,Miln,Campbell,Milton,Carey,Molligan,Carrington,Morrison,Carroll,Murphy,Carter,Nash,Chandter,Nathan,Chapman,Neal,Charlson,Nelson,Chesterton,Conors,Ogden,Cook,Oldman,Cramer,Oldridge,Creighton,Oliver,Croftoon,Osborne,Crossman,Oswald,Daniels,Otis,Davidson,Owen,Day,Sheldon,Fisher,Sherlock,Smith,Ford,Stanley,Freeman,Thomson,Fulton,Thorndike,Galbraith,Thornton,Gardner,Timmons,Clapton,Gate,Turner,Gerald,Vance,Gibbs,Vaughan,Gilbert,Wainwright,Gill,Walkman,Gilmore,Wallace,Gilson,Waller,Goldman,Ward,Goodman,Warren,Gustman,Watson,Haig,Wayne,Hailey,Webster,Hamphrey,Wesley,Hancock,White,Hardman,WifKinson,Harrison,Winter,Hawkins,Wood,Higgins,Youmans,Hodges,Young",
                    companies: "Systheon,Teknoplexon,Pacwest,SysVenamerica,RoboAerlogix,Venconix,Steganoconiche,Interliant,Aluco,Dynarama,Videobanc,Transtouch,Textiqua,Nanobanc,Vencom,Titanirola,Techtron,Unologic,Navivacs,Teraserv,eEyetanic,Orthosoft,Jamrola,SysUSA,Technogra,Superscope,Titanigraf,Allphysiche,Rapigrafix,Ameritron,Westtomik,Cryptotegrity,Multitiqua,US Omnigraphik,Keytheon,Generola,Compuamerica,Orthomedia,Cryptotemplate,Teratopia,Fibrotouch,Skydata,eSteganoergy,Inridium,Xeicon,OpKeycomm,Mescaridic,Netseco,Safetrust,Entcast,Hypervaco,Enlogia,Syssoft,Openserve,Truetomic,Airdyne,Allnet,Jamconik,InfoAirway,iSkyvaco,Pericenta,Netsystems,Robotemplate,Westmedia,iOptystix,Thermotomic,Conrama,iQualcar,Raylog,iEnland,Turbomart,Mescatron,Infragraph,Robotomic,Westgate,Gigaura,Sontopia,Conotomics,Qualserve,US Infratouch,Infraique,Fibrotopia,Unconix,Anagraph,iMedconik,Ventanium,Aprama,Robocomm,Anaframe,Truegate,Tekcar,Indisco,Idmax,Genland,Polytheon,Quintegrity,Celgra,Fibroserve,Safeagra,Proline",
                    cities: "Abilene,Akron,Albuquerque,NewMexico,Alexandria,Allentown,AmarilloAnaheim,Anchorage,Alaska,AnnArbor,Antioch,Arlington,Arvada,Athens,Atlanta,Augusta,Aurora,Austin,Bakersfield,Baltimore,Maryland,BatonRouge,Beaumont,Bellevue,Berkeley,Billings,Birmingham,Boise,IdahoBoston,Boulder,Bridgeport,Brownsville,Buffalo,Burbank,Cambridge,CapeCoral,Carrollton,Cary,CedarRapids,Centennial,Chandler,Charleston,Charlotte,Chattanooga,Chesapeake,Chicago,ChulaVista,Cincinnati,Clarksville,Clearwater,Cleveland,Springs,Columbia,Columbus,Concord,CoralSprings,Corona,CorpusChristi,CostaMesa,Dallas,Daly,Davenport,Dayton,Denton,Denver,DesMoines,Detroit,Downey,Durham,ElMonte,ElPaso,Elgin,Elizabeth,ElkGrove,Erie,Escondido,Eugene,Evansville,Fairfield,Fayetteville,Flint,Fontana,FortCollins,FortLauderdale,FortWayne,FortWorth,Fremont,Fresno,Frisco,Fullerton,Gainesville,GardenGrove,Garland,Gilbert,Glendale,GrandPrairie,GrandRapids,GreenBay,Greensboro,Gresham",
                    streets: "Walker Street,East Van Buren Street,Madison Avenue,Park Avenue South at 19th Street,Hudson Street,Harrison Street,Wall Street,Water Street,Tudor City Place, nr 43rd Street,Broadway at 88th Street,Greene Street,Bleecker Street,Elm street,Charles Street,Lafayette Street,Mercer Street,Spring Streets,Prince Streets,Wooster Street,Orchard Street,Stanton Streets,Rivington Streets,Thompson Street,Kenmare Streets,Lafayette Streets,Crosby Streets,Broome Streets,Duane Streets,Washington Street,Horatio Streets,Gansevoort Streets,Grand Street"
                },
                random: null
            },
            randomDataItem: function(e, t) {
                return this.cfg.data[e][t === !0 ? this.numeric(0, this.cfg.data[e].length - 1) : this.cfg.random[e]];
            },
            firstName: function(e) {
                return this.randomDataItem("firstNames", e);
            },
            lastName: function(e) {
                return this.randomDataItem("lastNames", e);
            },
            company: function(e) {
                return this.randomDataItem("companies", e);
            },
            city: function(e) {
                return this.randomDataItem("cities", e);
            },
            street: function(e) {
                return this.randomDataItem("streets", e);
            },
            phone: function() {
                return this.numeric(800, 899) + "-" + this.numeric(400, 600) + "-" + this.numeric(2e3, 4e3);
            },
            email: function() {
                var e = this.firstName(),
                    t = this.company();
                return (e + "@" + t + ".com").toLowerCase();
            },
            bool: function() {
                return Math.floor(2 * Math.random()) ? !0 : !1;
            },
            index: function() {
                return arguments[arguments.length - 1]
            },
            numeric: function(e, t) {
                var n = 0,
                    r = (e + "").split(".").pop().length;
                return "n" === e && (e = 1, t = 100), e = +e, t = +t, n = 0 === e % 1 ? Math.round(e - .5 + Math.random() * (t - e + 1)) : (Math.random() * (t - e) + e).toFixed(r), +n
            },
            date: function(e) {
                var t = new Date(1988, 0, 1),
                    n = new Date,
                    r = new Date(t.getTime() + Math.random() * (n.getTime() - t.getTime()));
                return e = e || "dd.MM.YY", datef(e, r)
            },
            guid: function() {
                var e = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx";
                return e.replace(/[xy]/g, function(e) {
                    var t = 0 | 16 * Math.random(),
                        n = "x" === e ? t : 8 | 3 & t;
                    return n.toString(16)
                })
            },
            lorem: function(e, t) {
                for (var n = "lorem ipsum dolor sit amet consectetuer adipiscing elit sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat ut wisi enim ad minim veniam quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat vel illum dolore eu feugiat nulla facilisis at vero eros et accumsan et iusto odio dignissim qui blandit praesent luptatum zzril delenit augue duis dolore te feugait nulla facilisi", r = n.split(" "), i = isNaN(parseInt(t, 10)) ? parseInt(e, 10) : this.numeric(e, t), o = [], a = "", l = function(e) {
                    return e ? e.charAt(0).toUpperCase() + e.slice(1) : ""
                }, s = 0; i > s; s++)
                o.push(r[this.numeric(0, +r.length - 1)]);
                if (i > 1) {
                    for (var u = 0; o.length > u; u++)
                    0 === u ? o[u] = l(o[u]) : u && 0 === u % 5 ? o[u] += "," : u && 0 === u % 14 && (o[u] += ".", o[u + 1] = l(o[u + 1]));
                    a = o.join(" ").replace(/\s?[\.,]?$/, ".")
                } else a = o.join("");
                return a
            }
        },
        generateJson: function(template) {
            var tpl = "";

            if (!this.inited) {
                this.init();
            }

            try {
                tpl = eval(template)
            } catch (error) {
                if (!(error instanceof SyntaxError && "function" == typeof this.config.onError)) throw error;
                return this.config.onError.call(this, error), undefined
            };
            var objectsArr = this.parseArray(tpl);

            this.generatedJson = {
                id: 1,
                jsonrpc: "2.0",
                total: objectsArr.length,
                result: objectsArr
            }, "function" == typeof this.config.onGenerateComplete && this.config.onGenerateComplete.call(this, this.generatedJson);

            return this.getJson();
        },
        getJson: function() {
            return this.generatedJson
        }
    };

    global.JsonGenerator = JsonGenerator;

    if (typeof module === 'object' && module.exports) {
        module.exports = JsonGenerator;
    }
}(this));
