export const ERRORS = {
  GENERIC: 'generic',
  UNAUTHORIZED: 'unauthorized',
  FORBIDDEN: 'forbidden',
  DATABASE_ERROR: 'database.thrown.an.error',
  NOT_FOUND_ENTITY: 'database.not.found.entity',
  CREATE_ENTITY_ERROR: 'database.thrown.an.error.while.entity.was.created',
  UPDATE_ENTITY_ERROR: 'database.thrown.an.error.while.entity.was.updated',
  DELETE_ENTITY_ERROR: 'database.thrown.an.error.while.entity.was.deleted',

  CUSTOM_ERROR: {
    BUSINESS_PARTNER: {
      NOT_FOUND_HIERARCHY_CODE: 'business_partner.dont.have.hierarchy.code',
      BLOCKED_TENANT: 'business_partner.is.blocked',
    },
    USER: {
      MISMATCH_PASSWORD: 'user.has.a.mismatch.password',
      ALREADY_CREATED_USER: 'user.already.exists',
      BLOCKED_USER: 'user.is.blocked',
      CREATED_USER: 'user.is.created',
    },
  },
};

export const HANDLED_ERRORS = {
  [ERRORS.GENERIC]: 'Ocorreu um erro! Entre em contato com o suporte.',

  [ERRORS.NOT_FOUND_ENTITY]: 'Não foi possível encontrar a entidade desejada.',
  [ERRORS.DATABASE_ERROR]: 'Ocorreu um erro! Entre em contato com o suporte.',
  [ERRORS.UNAUTHORIZED]: 'Seu usuário não está autorizado na plataforma.',
  [ERRORS.FORBIDDEN]:
    'Seu usuário não está autorizado para executar essa função!.',
  [ERRORS.CREATE_ENTITY_ERROR]:
    'Não conseguimos criar a entidade desejada! Entre em contato com o suporte',
  [ERRORS.UPDATE_ENTITY_ERROR]:
    'Não conseguimos atualizar a entidade desejada! Entre em contato com o suporte',
  [ERRORS.DELETE_ENTITY_ERROR]:
    'Não conseguimos excluior a entidade desejada! Entre em contato com o suporte',
  [ERRORS.NOT_FOUND_ENTITY]: 'Não foi possível encontrar a entidade desejada.',
  [ERRORS.CUSTOM_ERROR.BUSINESS_PARTNER.NOT_FOUND_HIERARCHY_CODE]:
    'O Business Partner não possui um código de hierarquia.',
  [ERRORS.CUSTOM_ERROR.USER.MISMATCH_PASSWORD]:
    'A senha informada não permitiu a autorização do usuário.',
  [ERRORS.CUSTOM_ERROR.USER.ALREADY_CREATED_USER]:
    'Um usuário com esse e-mail já foi criado!',
  [ERRORS.CUSTOM_ERROR.USER.BLOCKED_USER]:
    'O usuário está bloqueado, entre em contato com o administrador do sistema',
  [ERRORS.CUSTOM_ERROR.BUSINESS_PARTNER.BLOCKED_TENANT]:
    'A organização está bloqueada, entre em contato com o administrador do sistema',
};
