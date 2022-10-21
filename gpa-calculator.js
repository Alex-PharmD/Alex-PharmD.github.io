var app = angular.module('gpa-calculator', []);

app.directive('navSemester', function(){
  return {
    restrict: 'E',
    templateUrl: 'nav-semester.html'
  };
});

app.controller('calculator', function(){
  var that = this;

  this.years = years;
  this.grades = { };
  this.gpa = 0;

  this.initializeGrades = function (localGrades) {
    // Checks if grades exist in local storage.
    if(localGrades != null) {
      // Use value initialized in local storage.
      this.grades = JSON.parse(localGrades);
    } else {
      // copy GRADES object
      for (grade in GRADES) {
        this.grades[grade] = GRADES[grade];
      }
    }
  };

  this.initializeYears = function (localYears) {
    // Checks if year configuration exists in local storage.
    if(localYears != null) {
      // Use value initialized in local storage.
      that.years = JSON.parse(localYears);
    } else {
      // init subjects grades
      for(var i = 0; i < that.years.length; i++) {
        var year = that.years[i];
        for(var j = 0; j < year.length; j++) {
          var semester = year[j];
          semester.enabled = false;
          for(var k = 0; k < semester.subjects.length; k++) {
            var subject = semester.subjects[k];
            subject.grade = 'NA';
          }
        }
      }
    }
  };

  this.initializeGrades(localStorage.grades);
  this.initializeYears(localStorage.years);

  var yearsName = [['1', '2'], ['3', '4'], ['5', '6'],
                   ['7', '8'], ['9', '10']];
  this.getSemesterName = function (year,semester) {
    if (year < yearsName.length)
      return yearsName[year][semester];
  }

  this.calculateGPA = function () {
  	var num = 0, denom = 0;
    var semesterEnabledCount = 0;
    for(var i = 0; i < that.years.length; i++) {
      var year = that.years[i];
  		for(var j = 0; j < year.length; j++) {
        var semester = year[j];
  			if( !!semester.enabled ) {
          semesterEnabledCount += 1;
        }
      }
    }
    if( semesterEnabledCount == 10) {
      var modal = document.getElementById("myModal");

      modal.style.display = "block";
      // // Get the <span> element that closes the modal
      var span = document.getElementsByClassName("close")[0];

      
      // When the user clicks on <span> (x), close the modal
      span.onclick = function() {
        modal.style.display = "none";
      }

      // When the user clicks anywhere outside of the modal, close it
      window.onclick = function(event) {
        if (event.target == modal) {
          modal.style.display = "none";
        }
      }
    }

  	//Calculations
  	for(var i = 0; i < that.years.length; i++) {
      var year = that.years[i];
  		for(var j = 0; j < year.length; j++) {
        var semester = year[j];
  			if( !!semester.enabled ) {
  				for(var k = 0; k < semester.subjects.length; k++) {
            var subject = semester.subjects[k];
            if (!!subject.continuous || subject.grade == "NA") continue;
            subject.grade = subject.grade || 'A+';
            var points = that.grades[subject.grade] || GRADES[subject.grade]
  					num += points * (subject.totHours || subject.hours);
  					denom += (subject.totHours || subject.hours);
  				}
  			}
  		}
  	}

  	if(denom != 0) {
  		that.gpa = num / denom;
  	} else {
      that.gpa = 0;
    }

    localStorage.years = JSON.stringify(that.years);
    localStorage.grades = JSON.stringify(that.grades);
  };

  // Use to calculate the GPA when the page loads initially with certain local storage data.
  this.calculateGPA();
});

var GRADES = {
  'NA': 0,
  'A+': 4,
  'A': 3.85,
  'A-': 3.7,
  'B+': 3.3,
  'B': 3,
  'B-': 2.7,
  'C+': 2.3,
  'C': 2,
  'C-': 1.7,
  'D+': 1.3,
  'D': 1,
  'F': 0
};

var years = [
  [
    // Semester (1)
    {
      enabled: false,
      subjects: [
        { code: '02-06-07101', subject: 'Pharmaceutical Analytical Chemistry I', hours: 3 },
        { code: '02-06-05101', subject: 'Pharmaceutical Organic Chemistry I', hours: 3 },
        { code: '02-06-09101', subject: 'Pharmacy Orientation', hours: 1 },
        { code: '02-06-06101', subject: 'Medicinal Plants', hours: 3 },
        { code: '02-06-02101', subject: 'Medical Terminology', hours: 1 },
        { code: '02-06-00101', subject: 'Information Technology', hours: 2 },
        { code: '02-06-00102', subject: 'Mathematics', hours: 1 },
        { code: '02-06-00103', subject: 'Human Rights and Fighting Corruption *', hours: 1, continuous: true }
      ]
    },
    // Semester (2)
    {
      enabled: false,
      subjects: [
        { code: '02-06-07102', subject: 'Pharmaceutical Analytical Chemistry II', hours: 3 },
        { code: '02-06-05102', subject: 'Pharmaceutical Organic Chemistry II', hours: 3 },
        { code: '02-06-08101', subject: 'Cell Biology', hours: 2 },
        { code: '02-06-02102', subject: 'Human Anatomy& Histology', hours: 3 },
        { code: '02-06-01101', subject: 'Physical Pharmacy', hours: 3 },
        { code: '02-06-06102', subject: 'Pharmacognosy I', hours: 2 },
        { code: '02-06-09102', subject: 'Psychology', hours: 1 }
      ]
    }
  ],
  [
    // Semester (3)
    {
      enabled: false,
      subjects: [
        { code: '02-06-07203', subject: 'Pharmaceutical Analytical Chemistry III', hours: 2 },
        { code: '02-06-05203', subject: 'Pharmaceutical Organic Chemistry III',  hours: 3},
        { code: '02-06-06203', subject: 'Pharmacogncosy II', hours: 3 },
        { code: '02-06-02203', subject: 'Physiology and Pathophysiology', hours: 3 },
        { code: '02-06-01202', subject: 'Pharmaceutics I', hours: 3 },
        { code: '02-06-08202', subject: 'Biochemistry I', hours: 3 },
        { code: '02-00-00204', subject: 'Critical Thinking *', hours: 2, continuous: true }
      ]
    },
    // Semester (4)
    {
      enabled: false,
      subjects: [
        { code: '02-06-04201', subject: 'General Microbiology & Immunology', hours: 3 },
        { code: '02-06-07204', subject: 'Instrumental Analysis', hours: 3 },
        { code: '02-06-04202', subject: 'Pathology', hours: 2 },
        { code: '02-06-01203', subject: 'Pharmaceutics II', hours: 3 },
        { code: '02-06-05204', subject: 'Synthesis and Spectroscopic analysis of organic compounds', hours: 2 },
        { code: '02-06-09203', subject: 'Biostatistics & Evidence-based Medicine', hours: 2 },
        { code: '02-06-08203', subject: 'Biochemistry II', hours: 3 },
        { code: '02-06-EXX', subject: 'University Elective *', hours: 2 ,continuous: true}
      ]
    }
  ],
  [
    // Semester (5)
    {
      enabled: false,
      subjects: [
        { code: '02-06-04302', subject: 'Pharmaceutical Microbiology', hours: 3 },
        { code: ' 02-06-06304', subject: 'Phytochemistry I', hours: 3 },
        { code: '02-06-01304', subject: 'Pharmaceutics III', hours: 3 },
        { code: '02-06-09304', subject: 'Scientific Writing and Communication skills', hours: 2 },
        { code: '02-06-09305', subject: 'Drug Information', hours: 2 },
        { code: '02-06-05305', subject: 'Drug Design', hours: 2 },
        { code: '02-06-02305', subject: 'Basic Pharmacology', hours: 3 }
      ]
    },
    // Semester (6)
    {
      enabled: false,
      subjects: [
        { code: '02-06-04303', subject: 'Parasitology and Virology', hours: 3 },
        { code: '02-06-09306', subject: 'Community Pharmacy Practice', hours: 3 },
        { code: '02-06-06305', subject: 'Phytochemistry II', hours: 3 },
        { code: '02-06-01305', subject: 'Pharmaceutics IV', hours: 3 },
        { code: '02-06-05306', subject: 'Medicinal Chemistry I', hours: 3 },
        { code: '02-06-02306', subject: 'Pharmacology & Pharmacotherapeutics I', hours: 3 },
        { code: '02-06-EXX', subject: 'University Elective *', hours: 2 , continuous: true}
      ]
    }
  ],
  [
    // Semester (7)
    {
      enabled: false,
      subjects: [
        { code: '02-06-04404', subject: 'Medical Microbiology', hours: 3 },
        { code: '02-06-01406', subject: 'Biopharmaceutics and Pharmacokinetics', hours: 3 },
        { code: '02-06-08404', subject: 'Clinical Biochemistry', hours: 3 },
        { code: '02-06-02407', subject: 'First Aid', hours: 2 },
        { code: '02-06-09407', subject: 'Pharmacy Legislations and Professional Ethics', hours: 1 },
        { code: '02-06-05407', subject: 'Medicinal Chemistry II', hours: 3 },
        { code: '02-06-02408', subject: 'Medicinal Chemistry II', hours: 3 },
        { code: '02-06-0XEXX', subject: 'Faculty Elective', hours: 2 }
      ]
    },
    // Semester (8)
    {
      enabled: false,
      subjects: [
        { code: '02-06-09408', subject: 'Clinical Pharmacokinetics', hours: 3 },
        { code: '02-06-03401', subject: 'Pharmaceutical Technology I', hours: 3 },
        { code: '02-06-06406', subject: 'Phytotherapy', hours: 3 },
        { code: '02-06-02409', subject: 'Toxicology & Forensic Chemistry', hours: 3 },
        { code: '02-06-05408', subject: 'Medicinal Chemistry III', hours: 3 },
        { code: '02-06-02410', subject: 'Pharmacology & Pharmacotherapeutics III', hours: 3 },
        { code: '02-06-0XEXX', subject: 'Faculty Elective', hours: 2 },
        { code: '02-06-EXX', subject: 'University Elective *', hours: 2, continuous: true }
      ]
    }
  ],
  [
    // Semester (9)
    {
      enabled: false,
      subjects: [
        { code: 'CS431', subject: 'Pharmaceutical Biotechnology', hours: 3 },
        { code: 'CS4E1', subject: 'Public Health', hours: 2 },
        { code: 'CS4E2', subject: 'Pharmaceutical Technology II', hours: 3 },
        { code: 'CS441', subject: 'Clinical pharmacy I', hours: 3 },
        { code: 'CS401', subject: 'Hospital Pharmacy', hours: 2},
        { code: 'HSx64', subject: 'Pharmaceutical Management, Marketing & Pharmacoeconomics', hours: 2 },
        { code: 'HSx64', subject: 'Faculty Elective', hours: 2 },
        { code: 'HSx64', subject: 'University Elective *', hours: 2, continuous: true }
      ]
    },
    // Semester (10)
    {
      enabled: false,
      subjects: [
        { code: '02-06-07505', subject: 'Quality Control of Pharmaceuticals', hours: 3 },
        { code: '02-06-03503', subject: 'Good Manufacturing Practice', hours: 2 },
        { code: '02-06-01507', subject: 'Advanced Drug Delivery Systems', hours: 2 },
        { code: '02-06-09511', subject: 'Drug interaction', hours: 2 },
        { code: '02-06-09512', subject: 'Clinical Pharmacy II', hours: 2 },
        { code: '02-06-09513', subject: 'Clinical Research, Pharmacoepidemiology and & Pharmacovigilance', hours: 2 },
        { code: '02-06-0XEXX', subject: 'Faculty Elective', hours: 2 },
        { code: '02-06-00504', subject: 'Innovation and Entrepreneurship *', hours: 2, continuous: true }
      ]
    }
  ]
];
