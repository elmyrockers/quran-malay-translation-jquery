jsonData = {};
listOfSurah = [ "Al-Fatihah", "Al-Baqarah", "Ali-Imran", "An-Nisa", "Al-Ma'idah", "Al-An'am", "Al-A'raf", "Al-Anfal", "At-Taubah", "Yunus", "Hud", "Yusuf", "Ar-Ra'd", "Ibrahim", "Al-Hijr", "Al-Nahl", "Al-Isra'", "Al-Kahfi", "Maryam", "Taha", "Al-Anbiyaa'", "Al-Hajj", "Al-Mu'minun", "An-Nur", "Al-Furqan", "Asy-Syu'ara", "An-Naml", "Al-Qasas", "Al-Ankabut", "Ar-Rum", "Luqman", "As-Sajdah", "Al-Ahzab", "Saba'", "Fatir", "Yasin", "As-Saffat", "Sad", "Az-Zumar", "Ghafir", "Fussilat", "Asy-Syura", "Az-Zukhruf", "Ad-Dukhan", "Al-Jathiyah", "Al-Ahqaf", "Muhammad", "Al-Fath", "Al-Hujurat", "Qaf", "Az-Zariyat", "At-Tur", "An-Najm", "Al-Qamar", "Ar-Rahman", "Al-Waqi'ah", "Al-Hadid", "Al-Mujadalah", "Al-Hasyr", "Al-Mumtahanah", "As-Saff", "Al-Jumu'ah", "Al-Munafiqun", "At-Taghabun", "At-Talaq", "At-Tahrim", "Al-Mulk", "Al-Qalam", "Al-Haqqah", "Al-Ma'arij", "Nuh", "Al-Jin", "Al-Muzzammil", "Al-Muddath-thir", "Al-Qiamah", "Al-Insan", "Al-Mursalat", "An-Naba'", "An-Nazi'at", "'Abasa", "At-Takwir", "Al-Infitar", "Al-Mutaffifin", "Al-Insyiqaq", "Al-Buruj", "At-Tariq", "Al-A'laa", "Al-Ghasyiyah", "Al-Fajr", "Al-Balad", "Asy-Syams", "Al-Lail", "Adh-Dhuha", "Asy-Syarh", "At-Tin", "Al-'Alaq", "Al-Qadr", "Al-Bayyinah", "Az-Zalzalah", "Al-'Aadiyat", "Al-Qari'ah", "At-Takathur", "Al-'Asr", "Al-Humazah", "Al-Fil", "Quraisy", "Al-Maa'uun", "Al-Kauthar", "Al-Kafirun", "An-Nasr", "Al-Masad", "Al-Ikhlas", "Al-Falaq", "An-Nas" ];
function loadAllSurah()
{
	var progressbarWidth = 0,
		surahIndex = 0,
		fileLoading,
		surah,
		upProgressbarValue,
		loadJsonFile;

	upProgressbarValue = function ()
		{
			progressbarWidth += 1/114*100;
			progressbarWidth = progressbarWidth > 100 ? 100 : progressbarWidth;
			$( "div#progress div.w3-progressbar" )
					.css( "width", progressbarWidth+"%" )//panjang warna progressbar
					.text( progressbarWidth+"%" );//teks untuk nilai progressbar

			fileLoading = surahIndex < 114 ? "Memuatkan surah "+listOfSurah[ surahIndex ] : "Kesemua surah selesai dimuatkan..." ;
			$( "div#progress div.file-loading span" ).text( fileLoading );
		}
	loadJsonFile = function()
		{
			if ( surahIndex < 114 )
			{
			
			// Memuatkan fail-fail JSON
				surah = listOfSurah[ surahIndex ];
				$.ajax({
							//url: "assets/list_of_surah/"+surah+".json",
							//url: "http://alquran.epizy.com/assets/list_of_surah/"+surah+".json",
							url: "http://www.geocities.ws/elmyrockers/surah_in_json/"+surah+".json",
							dataType: "JSON",
							success: function ( data )
								{
									jsonData[ surah ] = data;//disimpan

									// Pengoperasian PROGRESSBAR
										upProgressbarValue();
										surahIndex++;

										loadJsonFile();
								},
							error: function ()
								{
									// body...
								}
						});
			}
			else
			{
				upProgressbarValue();
				setTimeout( function()
					{
						$( "div#progress" ).fadeOut( "slow", function()
							{
								$( "form#get-surah" ).slideDown( "slow" );
							});
					}, 1000 );
			}
		};

	loadJsonFile();
}


function displaySurah( surah )
{
	var surahData = {},
		surahHTML = "",
		number = 0;

	// Periksa input surah terlebih dahulu
		if ( surah === "-" )
		{
			$( "div#surah-content,div#search-result" ).stop( true ).fadeOut( "slow" );
		}
	// Jika surah telahpun berjaya dimuatkan
		else if ( typeof jsonData[ surah ] !== "undefined" )
		{
			surahData = jsonData[ surah ];
	// Jana kandungan HTML
			for( i in surahData )
			{
				number++;
				surahHTML +=	'<tr>';
				surahHTML +=	'	<th class="w3-border-right" style="width:10px"><span class="w3-badge w3-tiny w3-black">'+number+'</span></th>';
				surahHTML +=	'	<td>'+surahData[i]+'</td>';
				surahHTML +=	'	<td style="width:13%">';
				surahHTML +=	'		<div class="w3-col m4"><span class="w3-badge w3-blue">&nbsp;</span></div>';
				surahHTML +=	'		<div class="w3-col m4"><span class="w3-badge w3-green">&nbsp;</span></div>';
				surahHTML +=	'		<div class="w3-col m4"><span class="w3-badge w3-red">&nbsp;</span></div>';
				surahHTML +=	'	</td>';
				surahHTML +=	'</tr>\n';
			}
			//alert( surahHTML );

	// Masukkan ke dalam table bagi tujuan pemaparan
				$( "div#search-result" ).hide();
				$( "div#surah-content" ).fadeOut( "slow" ,function()
					{
						$( "div#surah-content span" ).text( "Surah "+surah );
						$( "div#surah-content table tbody" ).html( surahHTML );
						$( "div#surah-content" ).fadeIn( "slow" );
					});
		}
	// Sebaliknya, jika tidak wujud dalam jsonData(gagal), sembunyikan kandungan surah dan paparkan ralat
		else
		{
			$( "div#surah-content" ).fadeOut( "slow", function()
				{
					alert( "Kandungan fail JSON gagal dimuatkan" );
				});
		}
}

function listAllKeyword( keywords )
{
	var a,b,i,
		captureGroupOfWord,
		capturedKeyword,
		listOfKeyword = [];

	captureGroupOfWord = function()
		{
			// Periksa kewujudan kumpulan kata dalam tanda quote "
				a = keywords.indexOf( '"' );
				b = keywords.indexOf( '"', a+1 );
				if ( a > -1 && b > -1 )
					{
			// Tangkap kumpulan kata dan masukkan ke dalam senarai
						capturedKeyword = keywords.substring( a+1, b );
						if ( capturedKeyword )// Memastikan bukan rentetan kosong
							{
								listOfKeyword.push( $.trim( capturedKeyword ) );
							}
						keywords = keywords.replace( '"'+capturedKeyword+'"', "" );//padam untuk membuat carian semula
						captureGroupOfWord();
					}
		}
		captureGroupOfWord();

	// Tangkap senarai perkataan-perkataan solo
		capturedKeyword = keywords.split( " " );
			for( i in capturedKeyword )
			{
				if ( capturedKeyword[i] )
					{
						listOfKeyword.push( $.trim( capturedKeyword[i] ) );
					}
			}
		listOfKeyword = $.unique( listOfKeyword );

	return listOfKeyword;// Kembalikan senarai keyword lengkap
}

function displaySearchResult()
{
	// jika ruangan bagi input keywords terdapat nilai
	var startTime = new Date(),
		endTime,totalTime,
		f = $( "form#get-surah" ),
		surah = f.find( ":input[name=surah]" ).val(),
		keywords =  f.find( ":input[name=keywords]" ).val(),
		listOfKeyword = [],

		checkKeywords,searchInSurah,getSearchResultInHTML,search,// senarai function
		surahData,i,sentence,num,//;//searchResult = {},// function searchInSurah
		searchResult = {};

		keywords = $.trim( keywords.replace( /[\[\]\|\\]/g , "" ) );// Buang aksara-aksara yang tak diperlukan(yg boleh menyebabkan ralat)
	
	if ( keywords )
	{// Jika keyword dimasukkan
		// Jana keyword-keyword & masukkan ke dalam 1 senarai
			listOfKeyword = listAllKeyword( keywords );

		// Buat carian bagi setiap surah & ayat
			checkKeywords = function ( sentence )
				{
					var i, regExp, matchesKeyword, index, keyword, result = sentence;
					for( i in listOfKeyword )
					{
						regExp = new RegExp( listOfKeyword[i], "gi" );
						matchesKeyword = sentence.match( regExp );
						if ( $.isArray( matchesKeyword ) )
						{
							$.unique( matchesKeyword );
							for( index in matchesKeyword )
							{
								keyword = matchesKeyword[index];
								regExp = new RegExp( keyword, "g" );
								result = result.replace( regExp, '['+keyword+']' );
								//<strong class="w3-yellow"></strong>
							}
						}
						else
						{
							result = false;
							break;
						}
					}

					return result;
				}
			searchInSurah = function( surah )// currentSurah, keywords,
				{
					// Cari keywords di dalam surah bagi setiap ayat
						surahData = jsonData[ surah ];
						for( i in surahData )
						{
							sentence = checkKeywords( surahData[i] );//periksa keyword
					// Simpan ke dalam senarai jika OK...
							if ( sentence )
							{
								num = parseInt( i ) +1 ;
								num = num.toString();
								searchResult[ surah ] =  !$.isPlainObject( searchResult[ surah ] ) ? {} : searchResult[ surah ];
								searchResult[ surah ][ num ] = sentence;
							}
						}
				}
			getSearchResultInHTML = function ()
			{
				var surahName,num,sentence,searchResultInHTML = "", re1,re2;
				if ( !$.isEmptyObject( searchResult ) )
				{
					for( surahName in searchResult )
					{
						for( num in searchResult[ surahName ] )
						{
							sentence = searchResult[ surahName ][num];
							searchResultInHTML +=	'<tr>';
							searchResultInHTML +=	'	<th class="w3-border-right w3-hide-small" style="width:18%">'+surahName+':<span class="w3-badge w3-tiny w3-black">'+num+'</span></th>';
							searchResultInHTML +=	'	<th class="w3-border-right w3-hide-large w3-hide-medium w3-center" style="width:16%">'+surahName+':<br><span class="w3-badge w3-tiny w3-black">'+num+'</span></th>';
							searchResultInHTML +=	'	<td>'+sentence+'</td>';
							searchResultInHTML +=	'	<td style="width:13%">';
							searchResultInHTML +=	'		<div class="w3-col m4"><span class="w3-badge w3-blue">&nbsp;</span></div>';
							searchResultInHTML +=	'		<div class="w3-col m4"><span class="w3-badge w3-green">&nbsp;</span></div>';
							searchResultInHTML +=	'		<div class="w3-col m4"><span class="w3-badge w3-red">&nbsp;</span></div>';
							searchResultInHTML +=	'	</td>';
							searchResultInHTML +=	'</tr>\n';
						}
					}
				}
				else
				{
							searchResultInHTML +=	'<tr>';
							searchResultInHTML +=	'	<td colspan="3">Tiada sebarang keputusan ditemui</td>';
							searchResultInHTML +=	'</tr>\n';
				}
				// Tukarkan tanda [] kepada element <strong class="w3-yellow"></strong>
					searchResultInHTML = searchResultInHTML.replace( /\[/g , '<strong class="w3-yellow">' );
					searchResultInHTML = searchResultInHTML.replace( /\]/g , '</strong>' );

				return searchResultInHTML;
			}
			search = function()
				{
					if ( surah === "-" )
					{
						for( i in listOfSurah )
						{
							searchInSurah( listOfSurah[i] );
						}
					}
					else
					{
						searchInSurah( surah );
					}
					//keywordsYes = keywords;
					//result = searchResult;
					//resultHTMLYes = getSearchResultInHTML();
					searchResultInHTML = getSearchResultInHTML();// paparkan kepada pengguna
					$( "div#surah-content" ).hide();
					$( "div#search-result table tbody" ).html( searchResultInHTML );



					endTime = new Date();
					totalTime = (endTime - startTime)/1000;
					$( "div#search-result span#search-keywords" ).html( "Kata Kunci: "+keywords+'<i class="w3-right w3-small w3-hide-small">(Diproses dalam masa: '+totalTime+' saat)</i><i class="w3-right w3-small w3-hide-large w3-hide-medium">('+totalTime+' saat)</i>' );
					$( "div#search-result" ).show();
				};
			search();
	}
}



//------------------------------------------------------------------------
$(document).ready(function ()
{
	loadAllSurah();

	$( "form#get-surah select[name=surah]" ).select2().change( function(e)
		{
			var surah = $(this).val();
			displaySurah( surah );
		});

	$( "form#get-surah input[name=keywords]" ).keyup( function(e)
		{
			if ( e.which == 32 )
				{
					displaySearchResult();
				}
		});

	$( "form#get-surah" ).submit( function(e)
		{
			displaySearchResult();
			e.preventDefault();
		});

});