from django.contrib.auth import authenticate, login, logout
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated, AllowAny
from .serializers import UserSerializer , AdminSerializer , ClientSerializer , FreelancerSerializer , CompanySerializer , FAQSerializer , SkillSerializer , CategorySerializer , ReviewSerializer , ReportSerializer , MediaFileSerializer , NotificationSerializer , HelpSerializer , JobInternshipOfferSerializer , RequestSerializer , NegotiationSerializer , NegotiationFloatingCommentSerializer , NegotiationPhaseSerializer , ProjectSerializer , ProjectPhaseSerializer  , DeliverableSerializer
from .models import (
    User, Admin, Company, Client, Freelancer,
    Skill, Category, Review, FAQ, MediaFile, Report, Notification,
    Help, JobInternshipOffer, Request,
    Negotiation, NegotiationPhase, NegotiationFloatingComment,
    Project, ProjectPhase, Deliverable,
)
from django.db import IntegrityError
from django.core.files.storage import default_storage
from django.core.files.base import ContentFile
import os
from django.db.models import Count, Q

# User views ----------------------------------
@api_view(['POST'])
def register_freelancer(request):
    data = request.data.copy()
    email = data.get('email')
    password = data.get('password')
    if not email or not password:
        return Response({'detail': 'email and password are required'}, status=status.HTTP_400_BAD_REQUEST)

    data['role'] = 'freelancer'
    user_serializer = UserSerializer(data=data)
    if user_serializer.is_valid():
        user = user_serializer.save()
        if password:
            user.set_password(password)
            user.save()
        # create freelancer profile
        freelancer_data = data.get('freelancer', {})
        Freelancer.objects.create(user_id=user, **freelancer_data)
        return Response({'user': UserSerializer(user).data}, status=status.HTTP_201_CREATED)
    return Response(user_serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
def register_client(request):
    data = request.data.copy()
    email = data.get('email')
    password = data.get('password')
    if not email or not password:
        return Response({'detail': 'email and password are required'}, status=status.HTTP_400_BAD_REQUEST)

    data['role'] = 'client'
    user_serializer = UserSerializer(data=data)
    if user_serializer.is_valid():
        user = user_serializer.save()
        user.set_password(password)
        user.save()
        Client.objects.create(user_id=user)
        return Response({'user': UserSerializer(user).data}, status=status.HTTP_201_CREATED)
    return Response(user_serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
def register_company(request):
    data = request.data.copy()
    email = data.get('email')
    password = data.get('password')
    if not email or not password:
        return Response({'detail': 'email and password are required'}, status=status.HTTP_400_BAD_REQUEST)

    data['role'] = 'client'
    # companies are represented as client-role users with a Company profile
    user_serializer = UserSerializer(data=data)
    if user_serializer.is_valid():
        user = user_serializer.save()
        user.set_password(password)
        user.save()
        company_data = data.get('company', {})
        Company.objects.create(user_id=user, **company_data)
        return Response({'user': UserSerializer(user).data}, status=status.HTTP_201_CREATED)
    return Response(user_serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
def login_view(request):
    email = request.data.get('email')
    password = request.data.get('password')
    if not email or not password:
        return Response({'detail': 'email and password required'}, status=status.HTTP_400_BAD_REQUEST)

    user = authenticate(request, email=email, password=password)
    if user is None:
        return Response({'detail': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)
    login(request, user)
    return Response({'detail': 'Logged in', 'user': UserSerializer(user).data}, status=status.HTTP_200_OK)

@api_view(['POST'])
def logout_view(request):
    logout(request)
    return Response({'detail': 'Logged out'}, status=status.HTTP_200_OK)


@api_view(['GET'])
def verify_email(request, token):
    # Placeholder: implement token lookup + verification flow
    return Response({'detail': 'Email verification endpoint (token received)', 'token': token}, status=status.HTTP_200_OK)


@api_view(['POST'])
def forgot_password(request):
    # Placeholder: send password reset email with token
    email = request.data.get('email')
    if not email:
        return Response({'detail': 'email required'}, status=status.HTTP_400_BAD_REQUEST)
    return Response({'detail': 'If that email exists, a reset link was sent'}, status=status.HTTP_200_OK)


@api_view(['POST'])

def reset_password(request):
    # Placeholder: accept token and new_password, verify token then set password
    token = request.data.get('token')
    new_password = request.data.get('new_password')
    if not token or not new_password:
        return Response({'detail': 'token and new_password required'}, status=status.HTTP_400_BAD_REQUEST)
    return Response({'detail': 'Password reset simulated'}, status=status.HTTP_200_OK)


# ---------- Profile endpoints (freelancer/client/company) ----------
@api_view(['GET'])
def _is_owner_or_staff(user, profile_obj):
    try:
        return user.is_staff or (hasattr(profile_obj, 'user_id') and profile_obj.user_id.id == user.id)
    except Exception:
        return False



@api_view(['GET'])
def get_freelancer(request, id):
    freelancer = Freelancer.objects.get(id=id)
    return Response(FreelancerSerializer(freelancer).data)


@api_view(['PUT'])
def update_freelancer(request, id):
    freelancer = Freelancer.objects.get(id=id)
    if not _is_owner_or_staff(request.user, freelancer):
        return Response({'detail': 'Forbidden'}, status=status.HTTP_403_FORBIDDEN)
    serializer = FreelancerSerializer(freelancer, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['PUT'])
def update_freelancer_password(request, id):
    freelancer = Freelancer.objects.get(id=id)
    if not _is_owner_or_staff(request.user, freelancer):
        return Response({'detail': 'Forbidden'}, status=status.HTTP_403_FORBIDDEN)
    user = freelancer.user_id
    old = request.data.get('old_password')
    new = request.data.get('new_password')
    if not old or not new:
        return Response({'detail': 'old_password and new_password required'}, status=status.HTTP_400_BAD_REQUEST)
    if not user.check_password(old):
        return Response({'detail': 'old password incorrect'}, status=status.HTTP_400_BAD_REQUEST)
    user.set_password(new)
    user.save()
    return Response({'detail': 'Password updated'})

@api_view(['GET'])
def get_client(request, id):
    client = Client.objects.get(id=id)
    return Response(ClientSerializer(client).data)


@api_view(['PUT'])
def update_client(request, id):
    client = Client.objects.get(id=id)
    if not _is_owner_or_staff(request.user, client):
        return Response({'detail': 'Forbidden'}, status=status.HTTP_403_FORBIDDEN)
    serializer = ClientSerializer(client, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['PUT'])
def update_client_password(request, id):
    client = Client.objects.get(id=id)
    if not _is_owner_or_staff(request.user, client):
        return Response({'detail': 'Forbidden'}, status=status.HTTP_403_FORBIDDEN)
    user = client.user_id
    old = request.data.get('old_password')
    new = request.data.get('new_password')
    if not old or not new:
        return Response({'detail': 'old_password and new_password required'}, status=status.HTTP_400_BAD_REQUEST)
    if not user.check_password(old):
        return Response({'detail': 'old password incorrect'}, status=status.HTTP_400_BAD_REQUEST)
    user.set_password(new)
    user.save()
    return Response({'detail': 'Password updated'})


@api_view(['GET'])
def get_company(request, id):
    company = Company.objects.get(id=id)
    return Response(CompanySerializer(company).data)


@api_view(['PUT'])
def update_company(request, id):
    company = Company.objects.get(id=id)
    if not _is_owner_or_staff(request.user, company):
        return Response({'detail': 'Forbidden'}, status=status.HTTP_403_FORBIDDEN)
    serializer = CompanySerializer(company, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['PUT'])
def update_company_password(request, id):
    company = Company.objects.get(id=id)
    if not _is_owner_or_staff(request.user, company):
        return Response({'detail': 'Forbidden'}, status=status.HTTP_403_FORBIDDEN)
    user = company.user_id
    old = request.data.get('old_password')
    new = request.data.get('new_password')
    if not old or not new:
        return Response({'detail': 'old_password and new_password required'}, status=status.HTTP_400_BAD_REQUEST)
    if not user.check_password(old):
        return Response({'detail': 'old password incorrect'}, status=status.HTTP_400_BAD_REQUEST)
    user.set_password(new)
    user.save()
    return Response({'detail': 'Password updated'})


@api_view(['DELETE'])
def soft_delete_user(request, id):
    user = User.objects.get(id=id)
    if not (request.user.is_staff or request.user.id == user.id):
        return Response({'detail': 'Forbidden'}, status=status.HTTP_403_FORBIDDEN)
    user.is_active = False
    user.save()
    return Response({'detail': 'User deactivated'}, status=status.HTTP_200_OK)


# ---------- Request endpoints ----------
@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def requests_list_create(request):
    """GET /requests - list requests for current user (or all if staff)
       POST /requests - create a new request (client only)
    """
    if request.method == 'GET':
        if request.user.is_staff:
            qs = Request.objects.all()
        else:
            client = Client.objects.filter(user_id=request.user).first()
            if not client:
                return Response({'detail': 'No client profile for user'}, status=status.HTTP_404_NOT_FOUND)
            qs = Request.objects.filter(client_id=client)
        serializer = RequestSerializer(qs, many=True)
        return Response(serializer.data)

    # POST
    # assume authenticated user is client
    client = Client.objects.filter(user_id=request.user).first()
    if not client:
        return Response({'detail': 'Only clients can create requests'}, status=status.HTTP_403_FORBIDDEN)
    data = request.data.copy()
    data['client_id'] = client.id
    serializer = RequestSerializer(data=data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def list_client_requests(request, client_id):
    client = Client.objects.filter(id=client_id).first()
    if not client:
        return Response({'detail': 'Client not found'}, status=status.HTTP_404_NOT_FOUND)
    qs = Request.objects.filter(client_id=client)
    serializer = RequestSerializer(qs, many=True)
    return Response(serializer.data)


@api_view(['GET', 'PUT', 'DELETE'])
@permission_classes([IsAuthenticated])
def request_detail(request, id):
    req = Request.objects.filter(id=id).first()
    if not req:
        return Response({'detail': 'Request not found'}, status=status.HTTP_404_NOT_FOUND)

    # check ownership or staff
    is_owner = hasattr(req.client_id, 'user_id') and req.client_id.user_id.id == request.user.id
    if request.method == 'GET':
        if not (is_owner or request.user.is_staff):
            return Response({'detail': 'Forbidden'}, status=status.HTTP_403_FORBIDDEN)
        return Response(RequestSerializer(req).data)

    if request.method == 'PUT':
        if not (is_owner or request.user.is_staff):
            return Response({'detail': 'Forbidden'}, status=status.HTTP_403_FORBIDDEN)
        serializer = RequestSerializer(req, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    # DELETE -> soft delete: mark status as 'cancelled'
    if request.method == 'DELETE':
        if not (is_owner or request.user.is_staff):
            return Response({'detail': 'Forbidden'}, status=status.HTTP_403_FORBIDDEN)
        req.status = 'cancelled'
        req.save()
        return Response({'detail': 'Request cancelled (soft deleted)'} , status=status.HTTP_200_OK)


# ---------- Negotiation endpoints ----------
@api_view(['POST'])
def create_direct_hire(request, freelancer_id):
    """POST /negotiations/directhire/:freelancerId - client initiates a direct hire negotiation"""
    client = Client.objects.filter(user_id=request.user).first()
    if not client:
        return Response({'detail': 'Only clients can initiate direct hire'}, status=status.HTTP_403_FORBIDDEN)
    freelancer = Freelancer.objects.filter(id=freelancer_id).first()
    if not freelancer:
        return Response({'detail': 'Freelancer not found'}, status=status.HTTP_404_NOT_FOUND)
    data = {
        'origin_type': 'direct_hire',
        'client_id': client.id,
        'freelancer_id': freelancer.id,
        'status': 'in_progress',
        'client_agreed': True,
    }
    serializer = NegotiationSerializer(data=data)
    if serializer.is_valid():
        negotiation = serializer.save()
        return Response(NegotiationSerializer(negotiation).data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
def create_from_request(request, request_id):
    """POST /negotiations/:requestId/create - create negotiation linked to a Request"""
    req = Request.objects.filter(id=request_id).first()
    if not req:
        return Response({'detail': 'Request not found'}, status=status.HTTP_404_NOT_FOUND)
    # Only client who created request or staff can create negotiation for it
    if not (request.user.is_staff or req.client_id.user_id.id == request.user.id):
        return Response({'detail': 'Forbidden'}, status=status.HTTP_403_FORBIDDEN)
    data = request.data.copy()
    data['origin_type'] = 'request'
    data['request_id'] = req.id
    data['client_id'] = req.client_id.id
    serializer = NegotiationSerializer(data=data)
    if serializer.is_valid():
        negotiation = serializer.save()
        return Response(NegotiationSerializer(negotiation).data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'DELETE'])
def negotiation_detail(request, id):
    """GET /negotiations/:id - return negotiation and its phases
       DELETE /negotiations/:id - soft delete (set status to 'declined')
    """
    negotiation = Negotiation.objects.filter(id=id).first()
    if not negotiation:
        return Response({'detail': 'Negotiation not found'}, status=status.HTTP_404_NOT_FOUND)
    # ownership: client or freelancer or staff
    client_user_id = negotiation.client_id.user_id.id if negotiation.client_id else None
    freelancer_user_id = negotiation.freelancer_id.user_id.id if negotiation.freelancer_id else None
    is_owner = request.user.is_staff or request.user.id in (client_user_id, freelancer_user_id)
    if not is_owner:
        return Response({'detail': 'Forbidden'}, status=status.HTTP_403_FORBIDDEN)
    if request.method == 'GET':
        data = NegotiationSerializer(negotiation).data
        phases = NegotiationPhase.objects.filter(negotiation_id=negotiation)
        data['phases'] = NegotiationPhaseSerializer(phases, many=True).data
        return Response(data)
    # DELETE -> soft delete by setting status
    negotiation.status = 'declined'
    negotiation.save()
    return Response({'detail': 'Negotiation soft-deleted (declined)'}, status=status.HTTP_200_OK)



@api_view(['POST'])
def add_phase(request, id):
    """POST /negotiations/:id/phases - add a phase to negotiation"""
    negotiation = Negotiation.objects.filter(id=id).first()
    if not negotiation:
        return Response({'detail': 'Negotiation not found'}, status=status.HTTP_404_NOT_FOUND)
    # only negotiation participants or staff
    client_user_id = negotiation.client_id.user_id.id if negotiation.client_id else None
    freelancer_user_id = negotiation.freelancer_id.user_id.id if negotiation.freelancer_id else None
    if not (request.user.is_staff or request.user.id in (client_user_id, freelancer_user_id)):
        return Response({'detail': 'Forbidden'}, status=status.HTTP_403_FORBIDDEN)
    data = request.data.copy()
    data['negotiation_id'] = negotiation.id
    serializer = NegotiationPhaseSerializer(data=data)
    if serializer.is_valid():
        phase = serializer.save()
        return Response(NegotiationPhaseSerializer(phase).data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['PUT', 'DELETE'])
def negotiation_phase_detail(request, phase_id):
    """PUT /negotiations/phases/:phaseId - update
       DELETE /negotiations/phases/:phaseId - delete
    """
    phase = NegotiationPhase.objects.filter(id=phase_id).first()
    if not phase:
        return Response({'detail': 'Phase not found'}, status=status.HTTP_404_NOT_FOUND)
    negotiation = phase.negotiation_id
    client_user_id = negotiation.client_id.user_id.id if negotiation.client_id else None
    freelancer_user_id = negotiation.freelancer_id.user_id.id if negotiation.freelancer_id else None
    if not (request.user.is_staff or request.user.id in (client_user_id, freelancer_user_id)):
        return Response({'detail': 'Forbidden'}, status=status.HTTP_403_FORBIDDEN)
    if request.method == 'PUT':
        serializer = NegotiationPhaseSerializer(phase, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    # DELETE
    phase.delete()
    return Response({'detail': 'Phase deleted'}, status=status.HTTP_200_OK)


@api_view(['POST'])
def agree_negotiation(request, id):
    """POST /negotiations/:id/agree - current user agrees to negotiation"""
    negotiation = Negotiation.objects.filter(id=id).first()
    if not negotiation:
        return Response({'detail': 'Negotiation not found'}, status=status.HTTP_404_NOT_FOUND)
    client_user_id = negotiation.client_id.user_id.id if negotiation.client_id else None
    freelancer_user_id = negotiation.freelancer_id.user_id.id if negotiation.freelancer_id else None
    if request.user.id == client_user_id:
        negotiation.client_agreed = True
    elif request.user.id == freelancer_user_id:
        negotiation.freelancer_agreed = True
    else:
        return Response({'detail': 'Forbidden'}, status=status.HTTP_403_FORBIDDEN)
    # if both agreed set status
    if negotiation.client_agreed and negotiation.freelancer_agreed:
        negotiation.status = 'agreed'
    negotiation.save()
    return Response(NegotiationSerializer(negotiation).data)


@api_view(['POST'])
def decline_negotiation(request, id):
    """POST /negotiations/:id/decline - current user declines and provides reason"""
    negotiation = Negotiation.objects.filter(id=id).first()
    if not negotiation:
        return Response({'detail': 'Negotiation not found'}, status=status.HTTP_404_NOT_FOUND)
    reason = request.data.get('reason', '')
    # set declined_by and decline_reason
    negotiation.declined_by = request.user
    negotiation.decline_reason = reason
    negotiation.status = 'declined'
    negotiation.save()
    return Response(NegotiationSerializer(negotiation).data)


# ---------- Comments (negotiation + project) ----------
@api_view(['POST', 'GET'])
@permission_classes([IsAuthenticated])
def negotiation_comments(request, id):
    """POST to add comment, GET to list comments for a negotiation"""
    negotiation = Negotiation.objects.filter(id=id).first()
    if not negotiation:
        return Response({'detail': 'Negotiation not found'}, status=status.HTTP_404_NOT_FOUND)
    if request.method == 'GET':
        qs = NegotiationFloatingComment.objects.filter(negotiation=negotiation).exclude(status='deleted')
        return Response(NegotiationFloatingCommentSerializer(qs, many=True).data)

    # POST - create
    text = request.data.get('comment')
    parent_id = request.data.get('parent')
    x = request.data.get('x_position')
    y = request.data.get('y_position')
    if not text:
        return Response({'detail': 'comment text required'}, status=status.HTTP_400_BAD_REQUEST)
    parent = None
    if parent_id:
        parent = NegotiationFloatingComment.objects.filter(id=parent_id, negotiation=negotiation).first()
        if not parent:
            return Response({'detail': 'Parent comment not found'}, status=status.HTTP_404_NOT_FOUND)
    comment = NegotiationFloatingComment.objects.create(
        negotiation=negotiation,
        user=request.user,
        comment=text,
        parent=parent,
        x_position=x,
        y_position=y,
    )
    return Response(NegotiationFloatingCommentSerializer(comment).data, status=status.HTTP_201_CREATED)


# @api_view(['POST', 'GET'])
# @permission_classes([IsAuthenticated])
# def project_comments(request, id):
#     """POST to add comment, GET to list comments for a project"""
#     project = Project.objects.filter(id=id).first()
#     if not project:
#         return Response({'detail': 'Project not found'}, status=status.HTTP_404_NOT_FOUND)
#     if request.method == 'GET':
#         qs = ProjectComment.objects.filter(project=project).exclude(status='deleted')
#         return Response(ProjectCommentSerializer(qs, many=True).data)

#     # POST create
#     text = request.data.get('comment')
#     parent_id = request.data.get('parent')
#     if not text:
#         return Response({'detail': 'comment text required'}, status=status.HTTP_400_BAD_REQUEST)
#     parent = None
#     if parent_id:
#         parent = ProjectComment.objects.filter(id=parent_id, project=project).first()
#         if not parent:
#             return Response({'detail': 'Parent comment not found'}, status=status.HTTP_404_NOT_FOUND)
#     comment = ProjectComment.objects.create(
#         project=project,
#         user=request.user,
#         comment=text,
#         parent=parent,
#     )
#     return Response(ProjectCommentSerializer(comment).data, status=status.HTTP_201_CREATED)


@api_view(['PUT', 'DELETE'])
def update_or_delete_comment(request, id):
    """PUT update comment text, DELETE soft-delete (marks status='deleted')"""
    # try negotiation comment first
    ncomment = NegotiationFloatingComment.objects.filter(id=id).first()
    if ncomment:
        if not (request.user.is_staff or ncomment.user.id == request.user.id):
            return Response({'detail': 'Forbidden'}, status=status.HTTP_403_FORBIDDEN)
        if request.method == 'PUT':
            text = request.data.get('comment')
            if not text:
                return Response({'detail': 'comment text required'}, status=status.HTTP_400_BAD_REQUEST)
            ncomment.comment = text
            ncomment.save()
            return Response(NegotiationFloatingCommentSerializer(ncomment).data)
        # DELETE soft-delete via status
        ncomment.status = 'deleted'
        ncomment.save()
        return Response({'detail': 'Comment soft-deleted'})

 

@api_view(['POST'])
def resolve_comment(request, id):
    # mark negotiation or project comment as resolved
    ncomment = NegotiationFloatingComment.objects.filter(id=id).first()
    if ncomment:
        if not (request.user.is_staff or ncomment.user.id == request.user.id):
            return Response({'detail': 'Forbidden'}, status=status.HTTP_403_FORBIDDEN)
        ncomment.status = 'resolved'
        ncomment.save()
        return Response(NegotiationFloatingCommentSerializer(ncomment).data)


@api_view(['POST'])
def reply_to_comment(request, id):
    # find parent in negotiation comments
    parent_n = NegotiationFloatingComment.objects.filter(id=id).first()
    if parent_n:
        text = request.data.get('comment')
        if not text:
            return Response({'detail': 'comment text required'}, status=status.HTTP_400_BAD_REQUEST)
        reply = NegotiationFloatingComment.objects.create(
            negotiation=parent_n.negotiation,
            user=request.user,
            comment=text,
            parent=parent_n,
        )
        return Response(NegotiationFloatingCommentSerializer(reply).data, status=status.HTTP_201_CREATED)

    return Response({'detail': 'Parent comment not found'}, status=status.HTTP_404_NOT_FOUND)


# ---------- Project endpoints ----------
@api_view(['GET'])
def list_projects_for_user(request, user_id):
    """GET /projects/:user_id - list projects where the user is client or freelancer"""
    user = User.objects.filter(id=user_id).first()
    if not user:
        return Response({'detail': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
    client = Client.objects.filter(user_id=user).first()
    freelancer = Freelancer.objects.filter(user_id=user).first()
    qs = Project.objects.none()
    if client:
        qs = qs | Project.objects.filter(negotiation_id__client_id=client)
    if freelancer:
        qs = qs | Project.objects.filter(negotiation_id__freelancer_id=freelancer)
    serializer = ProjectSerializer(qs.distinct(), many=True)
    return Response(serializer.data)


@api_view(['GET', 'POST'])
def project_phases_list_create(request, id):
    """GET /projects/:id/phases - list phases
       POST /projects/:id/phases - add phase to project
    """
    project = Project.objects.filter(id=id).first()
    if not project:
        return Response({'detail': 'Project not found'}, status=status.HTTP_404_NOT_FOUND)
    negotiation = project.negotiation_id
    client_user_id = negotiation.client_id.user_id.id if negotiation and negotiation.client_id else None
    freelancer_user_id = negotiation.freelancer_id.user_id.id if negotiation and negotiation.freelancer_id else None
    if request.method == 'GET':
        if not (request.user.is_staff or request.user.id in (client_user_id, freelancer_user_id)):
            return Response({'detail': 'Forbidden'}, status=status.HTTP_403_FORBIDDEN)
        phases = ProjectPhase.objects.filter(project_id=project)
        return Response(ProjectPhaseSerializer(phases, many=True).data)

    # POST
    if not (request.user.is_staff or request.user.id in (client_user_id, freelancer_user_id)):
        return Response({'detail': 'Forbidden'}, status=status.HTTP_403_FORBIDDEN)
    data = request.data.copy()
    data['project_id'] = project.id
    serializer = ProjectPhaseSerializer(data=data)
    if serializer.is_valid():
        phase = serializer.save()
        return Response(ProjectPhaseSerializer(phase).data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['PUT', 'DELETE'])
def project_phase_detail(request, id, phase_id):
    """PUT/DELETE project phase"""
    project = Project.objects.filter(id=id).first()
    if not project:
        return Response({'detail': 'Project not found'}, status=status.HTTP_404_NOT_FOUND)
    phase = ProjectPhase.objects.filter(id=phase_id, project_id=project).first()
    if not phase:
        return Response({'detail': 'Phase not found'}, status=status.HTTP_404_NOT_FOUND)
    negotiation = project.negotiation_id
    client_user_id = negotiation.client_id.user_id.id if negotiation and negotiation.client_id else None
    freelancer_user_id = negotiation.freelancer_id.user_id.id if negotiation and negotiation.freelancer_id else None
    if not (request.user.is_staff or request.user.id in (client_user_id, freelancer_user_id)):
        return Response({'detail': 'Forbidden'}, status=status.HTTP_403_FORBIDDEN)
    if request.method == 'PUT':
        serializer = ProjectPhaseSerializer(phase, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    # DELETE = soft delete -> mark status as 'deleted'
    phase.status = 'deleted'
    phase.save()
    return Response({'detail': 'Phase soft-deleted'}, status=status.HTTP_200_OK)


@api_view(['POST'])
def start_phase(request, phase_id):
    phase = ProjectPhase.objects.filter(id=phase_id).first()
    if not phase:
        return Response({'detail': 'Phase not found'}, status=status.HTTP_404_NOT_FOUND)
    project = phase.project_id
    negotiation = project.negotiation_id
    freelancer_user_id = negotiation.freelancer_id.user_id.id if negotiation and negotiation.freelancer_id else None
    # only freelancer can start
    if request.user.id != freelancer_user_id and not request.user.is_staff:
        return Response({'detail': 'Forbidden'}, status=status.HTTP_403_FORBIDDEN)
    phase.status = 'in_progress'
    phase.save()
    return Response(ProjectPhaseSerializer(phase).data)


@api_view(['POST'])
def submit_phase(request, phase_id):
    phase = ProjectPhase.objects.filter(id=phase_id).first()
    if not phase:
        return Response({'detail': 'Phase not found'}, status=status.HTTP_404_NOT_FOUND)
    project = phase.project_id
    negotiation = project.negotiation_id
    freelancer_user_id = negotiation.freelancer_id.user_id.id if negotiation and negotiation.freelancer_id else None
    if request.user.id != freelancer_user_id and not request.user.is_staff:
        return Response({'detail': 'Forbidden'}, status=status.HTTP_403_FORBIDDEN)
    phase.status = 'waiting_client_review'
    phase.save()
    # optionally create deliverable if provided
    data = request.data.copy()
    if data.get('link') or data.get('attachment') or data.get('textcontent'):
        data['phase_id'] = phase.id
        dser = DeliverableSerializer(data=data)
        if dser.is_valid():
            dser.save()
    return Response(ProjectPhaseSerializer(phase).data)


@api_view(['POST'])
def approve_phase(request, phase_id):
    phase = ProjectPhase.objects.filter(id=phase_id).first()
    if not phase:
        return Response({'detail': 'Phase not found'}, status=status.HTTP_404_NOT_FOUND)
    project = phase.project_id
    negotiation = project.negotiation_id
    client_user_id = negotiation.client_id.user_id.id if negotiation and negotiation.client_id else None
    if request.user.id != client_user_id and not request.user.is_staff:
        return Response({'detail': 'Forbidden'}, status=status.HTTP_403_FORBIDDEN)
    phase.status = 'done'
    phase.save()
    return Response(ProjectPhaseSerializer(phase).data)


@api_view(['POST'])
def next_phase(request, phase_id):
    phase = ProjectPhase.objects.filter(id=phase_id).first()
    if not phase:
        return Response({'detail': 'Phase not found'}, status=status.HTTP_404_NOT_FOUND)
    project = phase.project_id
    negotiation = project.negotiation_id
    # allow client or system (staff)
    client_user_id = negotiation.client_id.user_id.id if negotiation and negotiation.client_id else None
    if request.user.id != client_user_id and not request.user.is_staff:
        return Response({'detail': 'Forbidden'}, status=status.HTTP_403_FORBIDDEN)
    # find next phase by created_at
    next_phase = ProjectPhase.objects.filter(project_id=project, created_at__gt=phase.created_at).order_by('created_at').first()
    if not next_phase:
        return Response({'detail': 'No next phase'}, status=status.HTTP_404_NOT_FOUND)
    next_phase.status = 'in_progress'
    next_phase.save()
    return Response(ProjectPhaseSerializer(next_phase).data)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def reject_phase(request, phase_id):
    """POST /projects/phases/:phase_id/reject - client (or admin) rejects the phase submission
    Sets phase back to 'in_progress' so freelancer can rework the deliverable.
    """
    phase = ProjectPhase.objects.filter(id=phase_id).first()
    if not phase:
        return Response({'detail': 'Phase not found'}, status=status.HTTP_404_NOT_FOUND)
    project = phase.project
    negotiation = project.negotiation
    client_user_id = negotiation.client.user_id.id if negotiation and negotiation.client else None
    if request.user.id != client_user_id and not request.user.is_staff:
        return Response({'detail': 'Forbidden'}, status=status.HTTP_403_FORBIDDEN)
    # move back to in_progress so freelancer resumes work
    phase.status = 'in_progress'
    phase.save()
    return Response(ProjectPhaseSerializer(phase).data)


@api_view(['GET'])
def get_project_detail(request, id):
    project = Project.objects.filter(id=id).first()
    if not project:
        return Response({'detail': 'Project not found'}, status=status.HTTP_404_NOT_FOUND)
    negotiation = project.negotiation_id
    client_user_id = negotiation.client_id.user_id.id if negotiation and negotiation.client_id else None
    freelancer_user_id = negotiation.freelancer_id.user_id.id if negotiation and negotiation.freelancer_id else None
    if not (request.user.is_staff or request.user.id in (client_user_id, freelancer_user_id)):
        return Response({'detail': 'Forbidden'}, status=status.HTTP_403_FORBIDDEN)
    data = ProjectSerializer(project).data
    phases = ProjectPhase.objects.filter(project_id=project)
    data['phases'] = ProjectPhaseSerializer(phases, many=True).data
    # include deliverables for each phase
    for p in data['phases']:
        items = Deliverable.objects.filter(phase_id_id=p['id'])
        p['deliverables'] = DeliverableSerializer(items, many=True).data
    return Response(data)


# ---------- FAQ endpoints ----------
@api_view(['GET'])
def get_faqs(request):
    """GET /faq - public list of FAQs"""
    faqs = FAQ.objects.all()
    serializer = FAQSerializer(faqs, many=True)
    return Response(serializer.data)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def admin_add_faq(request):
    """POST /admin/faq - admin only"""
    if not request.user.is_staff:
        return Response({'detail': 'Forbidden'}, status=status.HTTP_403_FORBIDDEN)
    serializer = FAQSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['PUT', 'DELETE'])
@permission_classes([IsAuthenticated])
def admin_manage_faq(request, id):
    """PUT /admin/faq/{id} Update, DELETE /admin/faq/{id} Delete (admin only)"""
    if not request.user.is_staff:
        return Response({'detail': 'Forbidden'}, status=status.HTTP_403_FORBIDDEN)
    faq = FAQ.objects.filter(id=id).first()
    if not faq:
        return Response({'detail': 'FAQ not found'}, status=status.HTTP_404_NOT_FOUND)
    if request.method == 'PUT':
        serializer = FAQSerializer(faq, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    # DELETE
    faq.delete()
    return Response({'detail': 'FAQ deleted'}, status=status.HTTP_200_OK)


# ---------- Help endpoints ----------
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_help(request):
    """POST /help - submit a help request (authenticated users)"""
    data = request.data.copy()
    problem = data.get('problem')
    if not problem:
        return Response({'detail': 'problem field is required'}, status=status.HTTP_400_BAD_REQUEST)
    data['user'] = request.user.id
    serializer = HelpSerializer(data=data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def my_help_requests(request):
    """GET /help/my - list help requests submitted by authenticated user"""
    qs = Help.objects.filter(user=request.user)
    serializer = HelpSerializer(qs, many=True)
    return Response(serializer.data)


@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def resolve_help_request(request, id):
    """PUT /help/:id/resolve - admin marks a help request as resolved"""
    if not request.user.is_staff:
        return Response({'detail': 'Forbidden'}, status=status.HTTP_403_FORBIDDEN)
    ticket = Help.objects.filter(id=id).first()
    if not ticket:
        return Response({'detail': 'Help request not found'}, status=status.HTTP_404_NOT_FOUND)
    ticket.status = 'resolved'
    ticket.save()
    return Response(HelpSerializer(ticket).data)


# ---------- Review endpoints ----------
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_review(request):
    """POST /reviews - client adds a review for a freelancer"""
    client = Client.objects.filter(user_id=request.user).first()
    if not client:
        return Response({'detail': 'Only clients can create reviews'}, status=status.HTTP_403_FORBIDDEN)
    data = request.data.copy()
    freelancer_id = data.get('freelancer_id')
    if not freelancer_id:
        return Response({'detail': 'freelancer_id is required'}, status=status.HTTP_400_BAD_REQUEST)
    freelancer = Freelancer.objects.filter(id=freelancer_id).first()
    if not freelancer:
        return Response({'detail': 'Freelancer not found'}, status=status.HTTP_404_NOT_FOUND)
    data['client'] = client.id
    data['client_id'] = client.id
    data['freelancer'] = freelancer.id
    data['freelancer_id'] = freelancer.id
    serializer = ReviewSerializer(data=data)
    try:
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    except IntegrityError:
        return Response({'detail': 'You have already reviewed this freelancer'}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
def list_reviews_for_freelancer(request, freelancer_id):
    """GET /reviews/freelancer/{freelancerId} - list reviews for a freelancer"""
    freelancer = Freelancer.objects.filter(id=freelancer_id).first()
    if not freelancer:
        return Response({'detail': 'Freelancer not found'}, status=status.HTTP_404_NOT_FOUND)
    qs = Review.objects.filter(freelancer=freelancer, is_deleted=False)
    serializer = ReviewSerializer(qs, many=True)
    return Response(serializer.data)


@api_view(['PUT', 'DELETE'])
@permission_classes([IsAuthenticated])
def update_or_delete_review(request, id):
    """PUT /reviews/{id} - owner only
       DELETE /reviews/{id} - soft delete (owner or admin)
    """
    review = Review.objects.filter(id=id).first()
    if not review:
        return Response({'detail': 'Review not found'}, status=status.HTTP_404_NOT_FOUND)
    owner_user_id = review.client.user_id.id if review.client and review.client.user_id else None
    if request.method == 'PUT':
        if request.user.id != owner_user_id:
            return Response({'detail': 'Forbidden'}, status=status.HTTP_403_FORBIDDEN)
        serializer = ReviewSerializer(review, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    # DELETE: owner or admin can soft-delete
    if not (request.user.is_staff or request.user.id == owner_user_id):
        return Response({'detail': 'Forbidden'}, status=status.HTTP_403_FORBIDDEN)
    review.is_deleted = True
    review.save()
    return Response({'detail': 'Review soft-deleted'}, status=status.HTTP_200_OK)


# ---------- Media / Files endpoints ----------
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def upload_media(request):
    """POST /media/upload
    Accepts multipart form with 'file' (or 'attachment'), 'entity_type' and 'entity_id'.
    Saves file using default storage and creates a MediaFile record.
    """
    upload = request.FILES.get('file') or request.FILES.get('attachment')
    entity_type = request.data.get('entity_type')
    entity_id = request.data.get('entity_id')
    if not upload or not entity_type or entity_id is None:
        return Response({'detail': 'file, entity_type and entity_id are required'}, status=status.HTTP_400_BAD_REQUEST)
    try:
        entity_id = int(entity_id)
    except Exception:
        return Response({'detail': 'entity_id must be an integer'}, status=status.HTTP_400_BAD_REQUEST)

    # save file to default storage under media/ folder
    filename = upload.name
    save_path = f"media/{filename}"
    # avoid overwriting: append suffix if exists
    base, ext = os.path.splitext(filename)
    counter = 0
    while default_storage.exists(save_path):
        counter += 1
        save_path = f"media/{base}_{counter}{ext}"
    saved_name = default_storage.save(save_path, ContentFile(upload.read()))
    # build accessible URL (may be relative)
    file_url = default_storage.url(saved_name)
    if not file_url.startswith('http'):
        file_url = request.build_absolute_uri(file_url)

    file_type = getattr(upload, 'content_type', '') or os.path.splitext(saved_name)[1].lstrip('.')

    media = MediaFile.objects.create(
        owner=request.user,
        entity_type=entity_type,
        entity_id=entity_id,
        file_url=file_url,
        file_type=file_type,
    )
    return Response(MediaFileSerializer(media).data, status=status.HTTP_201_CREATED)


@api_view(['GET'])
def list_media(request, entity_type, entity_id):
    """GET /media/:entityType/:entityId - list media for given entity
    Excludes items marked as deleted (we mark deleted media by setting file_type='deleted').
    """
    qs = MediaFile.objects.filter(entity_type=entity_type, entity_id=entity_id).exclude(file_type='deleted')
    serializer = MediaFileSerializer(qs, many=True)
    return Response(serializer.data)


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_media(request, id):
    """DELETE /media/:id - soft delete media file (mark file_type='deleted' and clear file_url)
    This is a migration-free soft-delete approach (no schema changes).
    """
    media = MediaFile.objects.filter(id=id).first()
    if not media:
        return Response({'detail': 'Media not found'}, status=status.HTTP_404_NOT_FOUND)
    if not (request.user.is_staff or media.owner.id == request.user.id):
        return Response({'detail': 'Forbidden'}, status=status.HTTP_403_FORBIDDEN)
    media.file_type = 'deleted'
    media.file_url = ''
    media.save()
    return Response({'detail': 'Media soft-deleted'}, status=status.HTTP_200_OK)


# ---------- Admin / Stats / Catalog endpoints ----------
@api_view(['GET'])
def admin_stats_users(request):
    if not request.user.is_staff:
        return Response({'detail': 'Forbidden'}, status=status.HTTP_403_FORBIDDEN)
    num_freelancers = Freelancer.objects.count()
    num_clients = Client.objects.count()
    num_companies = Company.objects.count()
    return Response({'freelancers': num_freelancers, 'clients': num_clients, 'companies': num_companies})


@api_view(['GET'])
def admin_stats_posts(request):
    if not request.user.is_staff:
        return Response({'detail': 'Forbidden'}, status=status.HTTP_403_FORBIDDEN)
    num_posts = JobInternshipOffer.objects.count()
    return Response({'posted_jobs': num_posts})


@api_view(['GET'])
def admin_stats_requests(request):
    if not request.user.is_staff:
        return Response({'detail': 'Forbidden'}, status=status.HTTP_403_FORBIDDEN)
    # consider 'active' requests as those pending or accepted
    active_qs = Request.objects.filter(status__in=['pending', 'accepted'])
    return Response({'active_requests': active_qs.count()})


@api_view(['GET'])
def admin_stats_negotiations(request):
    if not request.user.is_staff:
        return Response({'detail': 'Forbidden'}, status=status.HTTP_403_FORBIDDEN)
    active = Negotiation.objects.filter(status__in=['in_progress', 'agreed', 'completed']).count()
    declined = Negotiation.objects.filter(status='declined').count()
    return Response({'active_negotiations': active, 'declined_negotiations': declined})


@api_view(['GET'])
def admin_stats_projects(request):
    if not request.user.is_staff:
        return Response({'detail': 'Forbidden'}, status=status.HTTP_403_FORBIDDEN)
    # Active projects: those whose negotiation is not declined
    active = Project.objects.filter(~Q(negotiation__status='declined')).count()
    declined = Project.objects.filter(negotiation__status='declined').count()
    return Response({'active_projects': active, 'declined_projects': declined})


@api_view(['POST'])
def admin_add_skill(request):
    if not request.user.is_staff:
        return Response({'detail': 'Forbidden'}, status=status.HTTP_403_FORBIDDEN)
    serializer = SkillSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
def admin_add_category(request):
    if not request.user.is_staff:
        return Response({'detail': 'Forbidden'}, status=status.HTTP_403_FORBIDDEN)
    serializer = CategorySerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
def list_skills(request):
    qs = Skill.objects.all()
    return Response(SkillSerializer(qs, many=True).data)


@api_view(['GET'])
def list_categories(request):
    qs = Category.objects.all()
    return Response(CategorySerializer(qs, many=True).data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def admin_list_reports(request):
    if not request.user.is_staff:
        return Response({'detail': 'Forbidden'}, status=status.HTTP_403_FORBIDDEN)
    qs = Report.objects.all()
    serializer = ReportSerializer(qs, many=True)
    return Response(serializer.data)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def admin_resolve_report(request, id):
    if not request.user.is_staff:
        return Response({'detail': 'Forbidden'}, status=status.HTTP_403_FORBIDDEN)
    rpt = Report.objects.filter(id=id).first()
    if not rpt:
        return Response({'detail': 'Report not found'}, status=status.HTTP_404_NOT_FOUND)
    rpt.status = 'resolved'
    rpt.save()
    return Response(ReportSerializer(rpt).data)

