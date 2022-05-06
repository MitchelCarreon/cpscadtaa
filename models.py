from os import access

from sqlalchemy import true
from app import db, ma
from datetime import datetime
import pytz


class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(40), nullable=False, unique=True)
    email = db.Column(db.String(40), nullable=False, unique=True)
    accessLevel = db.Column(db.String(20), nullable=False)
    password = db.Column(db.String(40), nullable=False)

    # properties for email confirmation
    email_confirmation_sent_on = db.Column(db.DateTime, nullable=True)
    email_confirmed = db.Column(db.Boolean, nullable=True, default=False)
    email_confirmed_on = db.Column(db.DateTime, nullable=True)

    # Valid user?
    isValid = db.Column(db.Boolean, nullable=False, default=False)

    def __init__(self, **kwargs):
        super(User, self).__init__(**kwargs)
        self.email_confirmation_sent_on = datetime.now()

    def __repr__(self):
        return f'User-> Email:{self.email}, Username:{self.username}, Access Level:{self.accessLevel}, Password:{self.password}'

# Generate marshmallow Schemas from your models


class UserSchema(ma.Schema):
    class Meta:
        # Fields to expose
        fields = ("id", "username", "email", "accessLevel")


user_schema = UserSchema()
users_schema = UserSchema(many=True)

###########################################################
###################### INSTRUCTOR #########################
###########################################################


class Instructor(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    lastName = db.Column(db.String(30), nullable=False)
    firstName = db.Column(db.String(30), nullable=False)
    disciplineAreas = db.relationship(
        'InstructorDisciplineArea', backref='owning_instructor', lazy=True)
    maxLoad = db.Column(db.Integer, nullable=False, default=4)

    sections = db.relationship(
        'Section', backref='owning_instructor', lazy=True)  # many sections

    assigned_classes = db.relationship(
        'AssignedClass', backref="owning_instructor", lazy=True)

    def __repr__(self):
        return f'INSTRUCTOR -> NAME: {self.firstName} {self.lastName}, maxLoad: {self.maxLoad}\n disciplineAreas: {self.disciplineAreas}'


class InstructorSchema(ma.Schema):
    class Meta:
        # Fields to expose
        fields = ("id", "lastName", "firstName", "disciplineAreas", "maxLoad")


instructor_schema = InstructorSchema()
instructors_schema = InstructorSchema(many=True)


class InstructorDisciplineArea(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False)
    instructor_id = db.Column(db.Integer, db.ForeignKey(
        'instructor.id'), nullable=False)

    def __repr__(self):
        return f'<INSTRUCTOR DA >> NAME: {self.name}, INSTRUCTOR_ID: {self.instructor_id}>'


class InstructorDisciplineAreaSchema(ma.Schema):
    class Meta:
        # Fields to expose
        fields = ("id", "name", "instructor_id")


instructorDisciplineArea_schema = InstructorDisciplineAreaSchema()
instructorDisciplineAreas_schema = InstructorDisciplineAreaSchema(many=True)

########################################################
###################### COURSES #########################
########################################################


class Course(db.Model):
    # TODO: placeholder for reference number
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False, unique=True)
    number = db.Column(db.Integer, nullable=False, unique=True)
    deptCode = db.Column(db.String(10), nullable=False)
    disciplineAreas = db.relationship(
        'CourseDisciplineArea', backref='owning_course', lazy=True)
    referenceNumber = db.Column(db.Integer, nullable=False, unique=True)

    sections = db.relationship('Section', backref='owning_course', lazy=True)

    def __init__(self, **kwargs):
        super(Course, self).__init__(**kwargs)
        self.referenceNumber = 100 + len(Course.query.all())
    

    def __repr__(self):
        return f'<COURSE -> NAME: {self.name}, NUMBER: {self.number}, DEPTCODE= {self.deptCode}, disciplineAreas: {self.disciplineAreas}>'


class CourseSchema(ma.Schema):
    class Meta:
        fields = ("id", "name", "number", "deptCode", "disciplineAreas", "referenceNumber")


course_schema = CourseSchema()
courses_schema = CourseSchema(many=True)


class CourseDisciplineArea(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False)
    course_id = db.Column(db.Integer, db.ForeignKey(
        'course.id'), nullable=False)

    def __repr__(self):
        # for debugging
        return f'<COURSE DA >> NAME: {self.name}, COURSE_ID: {self.course_id}>'


class CourseDisciplineAreaSchema(ma.Schema):
    class Meta:
        fields = ("id", "name", "course_id")


courseDisciplineArea_schema = CourseDisciplineAreaSchema()
courseDisciplineAreas_schema = CourseDisciplineAreaSchema(many=True)


class Section(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    sectionNumber = db.Column(db.Integer,
                              nullable=False)  # section.number
    course_id = db.Column(db.Integer, db.ForeignKey(
        'course.id'), nullable=False)

    meetingPeriods = db.relationship(
        'MeetingPeriod', backref='owning_section', lazy=True)

    assigned_instructor = db.Column(
        db.Integer, db.ForeignKey('instructor.id'), nullable=True)  # one instructor

    assigned_classes = db.relationship(
        'AssignedClass', backref='owning_section', lazy=True)

    __table_args__ = (db.UniqueConstraint('course_id', 'sectionNumber'), )
    # UniqueConstraint: Each sectionNumber must be unique for each course (course_id).
    # COMMA at end is impt. needs to be a tuple. Otherwise, compile error

    def __repr__(self):
        return f'<SECTION -> Sec.#: {self.sectionNumber}, COURSE: {self.course_id}\n MeetingPeriods: {self.meetingPeriods}, assigned_instructor: {self.assigned_instructor}>'


class SectionSchema(ma.Schema):
    class Meta:
        fields = ("id", "sectionNumber", "course_id", "meetingPeriods")


section_schema = SectionSchema()
sections_schema = SectionSchema(many=True)


class MeetingPeriod(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    startTime = db.Column(db.DateTime, nullable=False)
    endTime = db.Column(db.DateTime, nullable=False)
    meetDay = db.Column(db.String(15), nullable=False)
    section_id = db.Column(db.Integer, db.ForeignKey(
        'section.id'), nullable=False)

    def __repr__(self):
        return f'<MEET_PERIOD >> DAY: {self.meetDay}, START: {self.startTime}, END: {self.endTime}>'


class MeetingPeriodSchema(ma.Schema):
    class Meta:
        fields = ("id", "startTime", "endTime", "meetDay", "section_id")


meetingPeriod_schema = MeetingPeriodSchema()
meetingPeriods_schema = MeetingPeriodSchema(many=True)


########################################################
###################### SCHEDULES #######################
########################################################

class PartialSchedule(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    assignedClasses = db.relationship(
        'AssignedClass', backref='owning_schedule', lazy=True)
    schedule_name = db.Column(db.String(
        35), nullable=False, default=f'Created on {datetime.now(pytz.timezone("America/Chicago")).strftime("%m/%d/%Y, %H:%M:%S")}')

    def __repr__(self):
        return f'PARTIALSCHEDULE -> assignedClasses: {self.assignedClasses}'


class PartialScheduleSchema(ma.Schema):
    class Meta:
        fields = ("id", "assignedClasses", "schedule_name")


partialSchedule_schema = PartialScheduleSchema()
partialSchedules_schema = PartialScheduleSchema(many=True)


class AssignedClass(db.Model):
    '''a pair of section and instructor. NOT synonymous to section'''
    id = db.Column(db.Integer, primary_key=True)

    assigned_section = db.Column(
        db.Integer, db.ForeignKey('section.id'), nullable=True)  # only 1 section.
    assigned_instructor = db.Column(
        db.Integer, db.ForeignKey('instructor.id'), nullable=True)  # only 1 instructor

    schedule_id = db.Column(db.Integer, db.ForeignKey(
        'partial_schedule.id'), nullable=False)  # one-to-many . only 1 schedule

    def __repr__(self):
        return f'<ASSIGNED_CLASS >> assigned_section: {self.assigned_section}, assigned_instructor: {self.assigned_instructor}, schedule_id: {self.schedule_id}>'


class AssignedClassSchema(ma.Schema):
    class Meta:
        fields = ("id", "assigned_section", "assigned_instructor")


assignedClass_schema = AssignedClassSchema()
assignedClasses_schema = AssignedClassSchema(many=True)

# class Articles(db.Model):
#     id = db.Column(db.Integer, primary_key=True)
#     title = db.Column(db.String(100),nullable=False)
#     body = db.Column(db.Text, nullable=False)
#     date = db.Column(db.DateTime(), default=datetime.utcnow)


#     def __repr__(self):
#         return "<Articles %r>" % self.title

# # Generate marshmallow Schemas from your models
# class ArticlesShema(ma.Schema):
#     class Meta:
#         # Fields to expose
#         fields = ("id","title", "body", "date")


# article_schema = ArticlesShema()
# articles_schema = ArticlesShema(many=True)
