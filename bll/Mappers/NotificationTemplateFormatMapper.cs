﻿using System;
using AutoMapper;
using Quantumart.QP8.DAL;

namespace Quantumart.QP8.BLL.Mappers
{
    internal class NotificationTemplateFormatMapper : GenericMapper<NotificationObjectFormat, ObjectFormatDAL>
    {
        public override void CreateDalMapper()
        {
            Mapper.CreateMap<NotificationObjectFormat, ObjectFormatDAL>()
                .ForMember(data => data.Locked, opt => opt.MapFrom(src => src.LockedBy == 0 ? null : (DateTime?)src.Locked))
                .ForMember(data => data.LockedBy, opt => opt.MapFrom(src => src.LockedBy == 0 ? null : (int?)src.LockedBy))
                .AfterMap(SetDalProperties);
        }

        private static void SetDalProperties(NotificationObjectFormat bizObject, ObjectFormatDAL dataObject)
        {
            if (bizObject.Assembled == null)
            {
                dataObject.Assembled = bizObject.Created;
            }
        }
    }
}
